module.exports = {
  'src_folders': ['./test/e2e-web'],
  'output_folder': false,
  'custom_commands_path': '',
  'custom_assertions_path': '',
  'page_objects_path': '',
  'globals_path': '',
  'selenium': {
    'start_process': true,
    'server_path': 'node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-3.0.1.jar',
    'log_path': '',
    'host': '127.0.0.1',
    'port': 4444,
    'cli_args': {
      'webdriver.chrome.driver': 'node_modules/chromedriver/bin/chromedriver',
      'webdriver.ie.driver': '',
    },
  },

  'test_settings': {
    'firefox': {
      'desiredCapabilities': {
        'browserName': 'firefox',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
      },
    },

    'chrome': {
      'desiredCapabilities': {
        'browserName': 'chrome',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
      },
    },

    'ie': {
      'desiredCapabilities': {
        'browserName': 'internet explorer',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
      },
    },

    'safari': {
      'desiredCapabilities': {
        'browserName': 'safari',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
      },
    },

  },

}
