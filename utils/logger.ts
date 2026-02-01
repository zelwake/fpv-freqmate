import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { consoleTransport, logger as rnLogger, transportFunctionType } from 'react-native-logs';

// Konfigurace log souborů
const LOG_DIR = new Directory(Paths.document, 'logs');
const LOG_NAME = 'app.log';
const MAX_LOG_SIZE = 1024 * 1024; // 1 MB
const MAX_LOG_FILES = 3; // app.log, app.log.1, app.log.2

// Vytvoření log složky při prvním spuštění
const ensureLogDirExists = () => {
  if (!LOG_DIR.exists) {
    LOG_DIR.create({ intermediates: true });
  }
};

type RotatingFileTransportProps = object;

// Custom file transport s rotací
const rotatingFileTransport: transportFunctionType<RotatingFileTransportProps> = async (props) => {
  try {
    console.debug({ msg: props.msg, level: props.level, extension: props.extension });

    ensureLogDirExists();

    const logFile = new File(LOG_DIR, LOG_NAME);

    if (logFile.exists && logFile.size >= MAX_LOG_SIZE) {
      for (let i = MAX_LOG_FILES - 1; i > 0; i--) {
        const oldFile = i === 1 ? LOG_NAME : `${LOG_NAME}.${i - 1}`;
        const newFileName = `${LOG_NAME}.${i}`;

        const oldFileInfo = new File(oldFile);
        if (oldFileInfo.exists) {
          if (i === MAX_LOG_FILES - 1) {
            oldFileInfo.delete();
          } else {
            oldFileInfo.rename(newFileName);
          }
        }
      }

      logFile.rename(`${LOG_NAME}.1`);
    }

    const currentLogFile = new File(LOG_DIR, LOG_NAME);
    const formattedMsg = `${props.msg.toString()}\n`;
    console.debug(`FormattedMsg: ${formattedMsg}`);

    if (currentLogFile.exists) {
      const existingContent = await currentLogFile.text();
      currentLogFile.write(existingContent + formattedMsg);
    } else {
      currentLogFile.write(formattedMsg);
    }

    return true;
  } catch (error) {
    console.error('Failed to write log to file:', error);
    return false;
  }
};

export const logger = rnLogger.createLogger({
  severity: __DEV__ ? 'debug' : 'info',
  transport: __DEV__ ? [consoleTransport, rotatingFileTransport] : [rotatingFileTransport],
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
      debug: 'white',
    },
  },
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  async: true,
  dateFormat: 'iso',
  printLevel: true,
  printDate: true,
  enabled: true,
});

/**
 * Exportuje všechny log soubory jako jeden spojený text
 */
export const exportLogs = async (): Promise<string> => {
  try {
    ensureLogDirExists();
    let allLogs = '';

    // Čti všechny log soubory v pořadí (od nejnovějšího)
    for (let i = 0; i < MAX_LOG_FILES; i++) {
      const fileName = i === 0 ? LOG_NAME : `${LOG_NAME}.${i}`;
      const logFile = new File(LOG_DIR, fileName);

      if (logFile.exists) {
        const content = await logFile.text();
        console.debug(`exportLogs logFile.text(): ${content}`);
        allLogs += `\n=== Log file ${i === 0 ? '(current)' : i} ===\n${content}\n`;
      }
    }

    return allLogs || 'No logs found';
  } catch (error) {
    console.error('Failed to export logs:', error);
    return `Error exporting logs: ${error}`;
  }
};

/**
 * Sdílí logy pomocí native share dialogu
 */
export const shareLogs = async (): Promise<void> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }

    // Vytvoř dočasný soubor se všemi logy
    const allLogs = await exportLogs();
    const tempDir = new Directory(Paths.cache);
    const tempFile = new File(tempDir, `app-logs-${Date.now()}.txt`);

    if (tempFile.exists) {
      tempFile.delete();
    }

    tempFile.write(allLogs);

    await Sharing.shareAsync(tempFile.uri, {
      mimeType: 'text/plain',
      dialogTitle: 'Share Application Logs',
      UTI: 'public.plain-text',
    });
  } catch (error) {
    console.error('Failed to share logs:', error);
    throw error;
  }
};

/**
 * Smaže všechny log soubory
 */
export const clearLogs = async (): Promise<void> => {
  try {
    ensureLogDirExists();

    for (let i = 0; i < MAX_LOG_FILES; i++) {
      const fileName = i === 0 ? LOG_NAME : `${LOG_NAME}.${i}`;
      const logFile = new File(LOG_DIR, fileName);

      if (logFile.exists) {
        logFile.delete();
      }
    }

    logger.info('All logs cleared');
  } catch (error) {
    console.error('Failed to clear logs:', error);
    throw error;
  }
};

/**
 * Vrací velikost všech log souborů v bytech
 */
export const getLogSize = async (): Promise<number> => {
  try {
    ensureLogDirExists();
    let totalSize = 0;

    for (let i = 0; i < MAX_LOG_FILES; i++) {
      const fileName = i === 0 ? LOG_NAME : `${LOG_NAME}.${i}`;
      const logFile = new File(LOG_DIR, fileName);

      if (logFile.exists && logFile.size) {
        totalSize += logFile.size;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Failed to get log size:', error);
    return 0;
  }
};
