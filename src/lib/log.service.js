class LogService {

  makelog(data) {
    let options = {};
    options.refer = document.referrer;
    options.url = window.location.href;
    if (data) {
      Object.assign(options, data);
    }
    if (window.report && window.report.logger) {
      window.report.logger.makelog(options);
    } else {
      setTimeout(() => {
        if (window.report && window.report.logger) {
          window.report.logger.makelog(options);
        }
      }, 500);
    }
  }

}

export default new LogService();
