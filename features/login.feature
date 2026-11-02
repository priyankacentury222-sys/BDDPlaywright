# Feature files describe behavior in Gherkin so scenarios remain readable to the whole team.
Feature: Login functionality
  As a SauceDemo user
  I want to sign in
  So that I can access the inventory

  @smoke
  Scenario: Successful login with valid credentials
    Given I navigate to the login page
    When I enter valid username and password
    And I click the login button
    Then I should be successfully logged in

  @regression
  Scenario: Login with invalid credentials
    Given I navigate to the login page
    When I enter invalid username and password
    And I click the login button
    Then I should see a login error message

  @regression
  Scenario: Verify error message for locked out user
    Given I navigate to the login page
    When I enter locked out user credentials
    And I click the login button
    Then I should see the locked out user error message