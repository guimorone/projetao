declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
      GOOGLE_PRIVATE_KEY: string;
      GOOGLE_SPREADSHEET_ID: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
