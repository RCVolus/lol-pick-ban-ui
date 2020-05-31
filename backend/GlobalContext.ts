class GlobalContext {
  commandLine: {
    data: string;
    record: string;
    leaguePath: string;
    experimentalConnector: boolean;
    debug: boolean;
  } = {
    data: '',
    record: '',
    leaguePath: '',
    experimentalConnector: false,
    debug: false,
  };
}

export default new GlobalContext();
