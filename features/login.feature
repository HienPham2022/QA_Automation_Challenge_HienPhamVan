@login
Feature: User Authentication
  As a user of the DemoBlaze store
  I want to log in, sign up, and manage my account
  So that I can access personalized features and make purchases

  Background:
    Given I am on the DemoBlaze homepage

  # ────────────────────────────────────────────
  # Functional Scenarios
  # ────────────────────────────────────────────

  @smoke @functional
  Scenario: Successful login with valid credentials
    When I open the login modal
    And I login with username "hienpham" and password "123"
    Then I should be logged in as "hienpham"

  @functional
  Scenario: Logout after successful login
    When I open the login modal
    And I login with username "hienpham" and password "123"
    And I should be logged in as "hienpham"
    And I logout
    Then I should be logged out

  @functional
  Scenario: Welcome message displays correct username
    When I open the login modal
    And I login with username "hienpham" and password "123"
    Then I should see welcome message containing "Welcome hienpham"

  @functional
  Scenario: Close login modal without logging in
    When I open the login modal
    Then the login modal should be visible
    When I close the login modal
    Then the login modal should not be visible

  @functional
  Scenario: Login modal displays all required fields
    When I open the login modal
    Then the login modal should display all required fields

  # ────────────────────────────────────────────
  # Negative Scenarios
  # ────────────────────────────────────────────

  @negative
  Scenario: Login with wrong password
    When I open the login modal
    And I login expecting an alert with username "hienpham" and password "wrongpass"
    Then I should see an alert with message containing "Wrong password"
    And I should not be logged in

  @negative
  Scenario: Login with non-existent user
    When I open the login modal
    And I login expecting an alert with username "nonexistent_user_xyz" and password "anypass"
    Then I should see an alert with message containing "User does not exist"
    And I should not be logged in

  @negative
  Scenario: Login with empty username
    When I open the login modal
    And I login expecting an alert with username "" and password "somepassword"
    Then I should see an alert with message containing "Please fill out"
    And I should not be logged in

  @negative
  Scenario: Login with empty password
    When I open the login modal
    And I login expecting an alert with username "someuser" and password ""
    Then I should see an alert with message containing "Please fill out"
    And I should not be logged in

  @negative
  Scenario: Login with both fields empty
    When I open the login modal
    And I login expecting an alert with username "" and password ""
    Then I should see an alert with message containing "Please fill out"
    And I should not be logged in

  # ────────────────────────────────────────────
  # Security / Edge Case Scenarios
  # ────────────────────────────────────────────

  @security @edge-case
  Scenario: SQL Injection attempt in login
    When I open the login modal
    And I login expecting an alert with username "' OR '1'='1" and password "' OR '1'='1"
    Then I should not be logged in

  @security @edge-case
  Scenario: XSS attempt in login
    When I open the login modal
    And I login expecting an alert with username "<script>alert('xss')</script>" and password "password123"
    Then I should not be logged in

  # ────────────────────────────────────────────
  # Signup Scenarios
  # ────────────────────────────────────────────

  @functional @signup
  Scenario: Signup with a new unique user
    When I open the signup modal
    And I signup with a new random user
    Then I should see an alert with message containing "Sign up successful"

  @negative @signup
  Scenario: Signup with an already existing username
    When I open the signup modal
    And I signup with username "hienpham" and password "123"
    Then I should see an alert with message containing "already exist"

  @negative @signup
  Scenario: Signup with empty fields
    When I open the signup modal
    And I signup with username "" and password ""
    Then I should see an alert with message containing "Please fill out"

  # ────────────────────────────────────────────
  # UI/UX Scenarios
  # ────────────────────────────────────────────

  @ui
  Scenario: Signup modal displays all required fields
    When I open the signup modal
    Then the signup modal should display all required fields
