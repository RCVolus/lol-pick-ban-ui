class GlobalContext {
  commandLine: {
    data: string;
    record: string;
    leaguePath: string;
  } = {
    data: '',
    record: '',
    leaguePath: '',
  };
}

export default new GlobalContext();
