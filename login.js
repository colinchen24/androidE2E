"use strict";

require("./helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');

describe("android simple", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  before(function () {
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);
    var desired = _.clone(require("./helpers/caps").android19);
    desired.app = require("./helpers/apps").androidApiDemos;

    return driver
      .init(desired)
      .setImplicitWaitTimeout(3000);
  });

  after(function () {
    return driver
      .quit()
      .finally(function () {
        if (process.env.npm_package_config_sauce) {
          return driver.sauceJobStatus(allPassed);
        }
      });
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it("should login successfully", function () {
    return driver
      .waitForElementByClassName("android.widget.Button")
      .elementById("server_addr_imgbtn")
      .click()
      .elementByXPath("//android.widget.CheckedTextView[@text='US QA']")
      .click()
      .elementById("button1")
      .click()
      .waitForElementByClassName("android.widget.Button")
      .elementById("account_txt")
      .sendKeys("colinc")
      .elementById("password")
      .sendKeys("qwer1234")
      .elementById("sign_in_button")
      .click()
  });
});
