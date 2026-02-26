@login
Feature: User Authentication
  As a user of the DemoBlaze store
  I want to log in, sign up, and manage my account
  So that I can access personalized features and make purchases

  Background:
    Given I am on the DemoBlaze homepage

  # ════════════════════════════════════════════════════════════════════════════
  #                           HAPPY PATH SCENARIOS
  # ════════════════════════════════════════════════════════════════════════════

  # ────────────────────────────────────────────
  # Login - Happy Path
  # ────────────────────────────────────────────

  @smoke @happy-path
  Scenario: Successful login with valid credentials
    When I open the login modal
    And I login with username "hienpham" and password "123"
    Then I should be logged in as "hienpham"

  @happy-path
  Scenario: Welcome message displays correct username after login
    When I open the login modal
    And I login with username "hienpham" and password "123"
    Then I should see welcome message containing "Welcome hienpham"

  @happy-path
  Scenario: Logout after successful login
    When I open the login modal
    And I login with username "hienpham" and password "123"
    And I should be logged in as "hienpham"
    And I logout
    Then I should be logged out

  @happy-path
  Scenario: Re-login after logout
    When I open the login modal
    And I login with username "hienpham" and password "123"
    And I should be logged in as "hienpham"
    And I logout
    And I should be logged out
    And I open the login modal
    And I login with username "hienpham" and password "123"
    Then I should be logged in as "hienpham"

  @happy-path
  Scenario: Login persists after page refresh
    When I open the login modal
    And I login with username "hienpham" and password "123"
    And I should be logged in as "hienpham"
    And I refresh the page
    Then I should be logged in as "hienpham"

  # ────────────────────────────────────────────
  # Signup - Happy Path
  # ────────────────────────────────────────────

  @smoke @happy-path @signup
  Scenario: Signup with a new unique user
    When I open the signup modal
    And I signup with a new random user
    Then I should see an alert with message containing "Sign up successful"

  @happy-path @signup
  Scenario: Login with newly created account
    When I open the signup modal
    And I signup with a new random user and remember credentials
    Then I should see an alert with message containing "Sign up successful"
    When I open the login modal
    And I login with the remembered credentials
    Then I should be logged in successfully

  # ────────────────────────────────────────────
  # Modal UI - Happy Path
  # ────────────────────────────────────────────

  @happy-path @ui
  Scenario: Login modal displays all required fields
    When I open the login modal
    Then the login modal should be visible
    And the login modal should display all required fields

  @happy-path @ui
  Scenario: Close login modal without logging in
    When I open the login modal
    Then the login modal should be visible
    When I close the login modal
    Then the login modal should not be visible

  @happy-path @ui
  Scenario: Signup modal displays all required fields
    When I open the signup modal
    Then the signup modal should be visible
    And the signup modal should display all required fields

  @happy-path @ui
  Scenario: Close signup modal without signing up
    When I open the signup modal
    Then the signup modal should be visible
    When I close the signup modal
    Then the signup modal should not be visible

  # ════════════════════════════════════════════════════════════════════════════
  #                           EDGE CASE SCENARIOS
  # ════════════════════════════════════════════════════════════════════════════

  # ────────────────────────────────────────────
  # Login - Negative / Validation
  # ────────────────────────────────────────────

  @edge-case @negative
  Scenario: Login with wrong password
    When I open the login modal
    And I login expecting an alert with username "hienpham" and password "wrongpass"
    Then I should see an alert with message containing "Wrong password"
    And I should not be logged in

  @edge-case @negative
  Scenario: Login with non-existent user
    When I open the login modal
    And I login expecting an alert with username "nonexistent_user_xyz_12345" and password "anypass"
    Then I should see an alert with message containing "User does not exist"
    And I should not be logged in

  @edge-case @negative
  Scenario: Login with empty username
    When I open the login modal
    And I login expecting an alert with username "" and password "somepassword"
    Then I should see an alert with message containing "Please fill out"
    And I should not be logged in

  @edge-case @negative
  Scenario: Login with empty password
    When I open the login modal
    And I login expecting an alert with username "someuser" and password ""
    Then I should see an alert with message containing "Please fill out"
    And I should not be logged in

  @edge-case @negative
  Scenario: Login with both fields empty
    When I open the login modal
    And I login expecting an alert with username "" and password ""
    Then I should see an alert with message containing "Please fill out"
    And I should not be logged in

  @edge-case @negative
  Scenario: Login with username containing only spaces
    When I open the login modal
    And I login expecting an alert with username "   " and password "password123"
    Then I should see an alert with message containing "Wrong password"
    And I should not be logged in

  @edge-case @negative
  Scenario: Login with password containing only spaces
    When I open the login modal
    And I login expecting an alert with username "hienpham" and password "   "
    Then I should see an alert with message containing "Wrong password"
    And I should not be logged in

  @edge-case @negative
  Scenario: Login with case-sensitive username (wrong case)
    When I open the login modal
    And I login expecting an alert with username "HIENPHAM" and password "123"
    Then I should not be logged in

  # ────────────────────────────────────────────
  # Login - Boundary / Input Limits
  # ────────────────────────────────────────────

  @edge-case @boundary
  Scenario: Login with very long username (100+ characters)
    When I open the login modal
    And I login expecting an alert with username "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" and password "password"
    Then I should not be logged in

  @edge-case @boundary
  Scenario: Login with very long password (100+ characters)
    When I open the login modal
    And I login expecting an alert with username "hienpham" and password "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    Then I should not be logged in

  @edge-case @boundary
  Scenario: Login with single character username
    When I open the login modal
    And I login expecting an alert with username "a" and password "123"
    Then I should not be logged in

  @edge-case @boundary
  Scenario: Login with single character password
    When I open the login modal
    And I login expecting an alert with username "hienpham" and password "x"
    Then I should not be logged in

  # ────────────────────────────────────────────
  # Login - Special Characters
  # ────────────────────────────────────────────

  @edge-case @special-chars
  Scenario: Login with special characters in username
    When I open the login modal
    And I login expecting an alert with username "user!@#$%^&*()" and password "password"
    Then I should not be logged in

  @edge-case @special-chars
  Scenario: Login with unicode characters in username
    When I open the login modal
    And I login expecting an alert with username "用户名" and password "password"
    Then I should not be logged in

  @edge-case @special-chars
  Scenario: Login with email format username
    When I open the login modal
    And I login expecting an alert with username "test@example.com" and password "password"
    Then I should not be logged in

  # ────────────────────────────────────────────
  # Login - Security
  # ────────────────────────────────────────────

  @edge-case @security
  Scenario: SQL Injection attempt in username
    When I open the login modal
    And I login expecting an alert with username "' OR '1'='1" and password "' OR '1'='1"
    Then I should not be logged in

  @edge-case @security
  Scenario: SQL Injection attempt with DROP statement
    When I open the login modal
    And I login expecting an alert with username "'; DROP TABLE users;--" and password "password"
    Then I should not be logged in

  @edge-case @security
  Scenario: XSS attempt in username field
    When I open the login modal
    And I login expecting an alert with username "<script>alert('xss')</script>" and password "password123"
    Then I should not be logged in

  @edge-case @security
  Scenario: XSS attempt in password field
    When I open the login modal
    And I login expecting an alert with username "testuser" and password "<img src=x onerror=alert('xss')>"
    Then I should not be logged in

  @edge-case @security
  Scenario: HTML injection attempt in login
    When I open the login modal
    And I login expecting an alert with username "<h1>Hacked</h1>" and password "password"
    Then I should not be logged in

  # ────────────────────────────────────────────
  # Signup - Negative / Validation
  # ────────────────────────────────────────────

  @edge-case @negative @signup
  Scenario: Signup with an already existing username
    When I open the signup modal
    And I signup with username "hienpham" and password "123"
    Then I should see an alert with message containing "already exist"

  @edge-case @negative @signup
  Scenario: Signup with empty username
    When I open the signup modal
    And I signup with username "" and password "password123"
    Then I should see an alert with message containing "Please fill out"

  @edge-case @negative @signup
  Scenario: Signup with empty password
    When I open the signup modal
    And I signup with username "newuser123" and password ""
    Then I should see an alert with message containing "Please fill out"

  @edge-case @negative @signup
  Scenario: Signup with both fields empty
    When I open the signup modal
    And I signup with username "" and password ""
    Then I should see an alert with message containing "Please fill out"

  @edge-case @negative @signup
  Scenario: Signup with username containing only spaces
    When I open the signup modal
    And I signup with username "   " and password "password123"
    Then I should see an alert with message containing "already exist"

  # ────────────────────────────────────────────
  # Signup - Boundary / Input Limits
  # ────────────────────────────────────────────

  @edge-case @boundary @signup
  Scenario: Signup with very long username
    When I open the signup modal
    And I signup with username "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" and password "password123"
    Then I should see an alert

  @edge-case @boundary @signup
  Scenario: Signup with very short password (1 character)
    When I open the signup modal
    And I signup with a new random user with short password "a"
    Then I should see an alert

  # ────────────────────────────────────────────
  # Signup - Security
  # ────────────────────────────────────────────

  @edge-case @security @signup
  Scenario: Signup with SQL injection in username
    When I open the signup modal
    And I signup with username "'; DROP TABLE users;--" and password "password123"
    Then I should see an alert

  @edge-case @security @signup
  Scenario: Signup with XSS in username
    When I open the signup modal
    And I signup with username "<script>alert('xss')</script>" and password "password123"
    Then I should see an alert

  # ────────────────────────────────────────────
  # Session Management Edge Cases
  # ────────────────────────────────────────────

  @edge-case @session
  Scenario: Multiple login attempts with wrong password
    When I open the login modal
    And I login expecting an alert with username "hienpham" and password "wrong1"
    Then I should see an alert with message containing "Wrong password"
    When I close the login modal
    And I open the login modal
    And I login expecting an alert with username "hienpham" and password "wrong2"
    Then I should see an alert with message containing "Wrong password"
    And I should not be logged in

  @edge-case @session
  Scenario: Login modal can be reopened after closing
    When I open the login modal
    And I close the login modal
    And I open the login modal
    Then the login modal should be visible
    And the login modal should display all required fields

  # ────────────────────────────────────────────
  # Login - Input Manipulation
  # ────────────────────────────────────────────

  @edge-case @input-manipulation
  Scenario: Login with leading spaces in username
    When I open the login modal
    And I login expecting an alert with username "  hienpham" and password "123"
    Then I should not be logged in

  @edge-case @input-manipulation
  Scenario: Login with trailing spaces in username
    When I open the login modal
    And I login expecting an alert with username "hienpham  " and password "123"
    Then I should not be logged in

  @edge-case @input-manipulation
  Scenario: Login with leading and trailing spaces in password
    When I open the login modal
    And I login expecting an alert with username "hienpham" and password "  123  "
    Then I should not be logged in

  @edge-case @input-manipulation
  Scenario: Login with tab character in username
    When I open the login modal
    And I login expecting an alert with username "hien	pham" and password "123"
    Then I should not be logged in

  @edge-case @input-manipulation
  Scenario: Login with newline character in username
    When I open the login modal
    And I login expecting an alert with username "hien\npham" and password "123"
    Then I should not be logged in

  # ────────────────────────────────────────────
  # Login - UI Interaction
  # ────────────────────────────────────────────

  @edge-case @ui-interaction
  Scenario: Submit login form by pressing Enter key
    When I open the login modal
    And I enter username "hienpham" in login modal
    And I enter password "123" in login modal
    And I press Enter key to submit login
    Then I should be logged in as "hienpham"

  @edge-case @ui-interaction
  Scenario: Double click on login button
    When I open the login modal
    And I enter username "hienpham" in login modal
    And I enter password "123" in login modal
    And I double click the login button
    Then I should be logged in as "hienpham"

  @edge-case @ui-interaction
  Scenario: Rapid multiple login button clicks
    When I open the login modal
    And I enter username "hienpham" in login modal
    And I enter password "123" in login modal
    And I click login button multiple times rapidly
    Then I should be logged in as "hienpham"

  # ────────────────────────────────────────────
  # Signup - Additional Edge Cases
  # ────────────────────────────────────────────

  @edge-case @signup @input-validation
  Scenario: Signup with password same as username
    When I open the signup modal
    And I signup with a new random user with password same as username
    Then I should see an alert with message containing "Sign up successful"

  @edge-case @signup @input-validation
  Scenario: Signup with numeric-only username
    When I open the signup modal
    And I signup with username "123456789" and password "password123"
    Then I should see an alert

  @edge-case @signup @input-validation
  Scenario: Signup with numeric-only password
    When I open the signup modal
    And I signup with a new random user with numeric password "123456"
    Then I should see an alert with message containing "Sign up successful"

  @edge-case @signup @workflow
  Scenario: Signup and immediately login with same credentials
    When I open the signup modal
    And I signup with a new random user and remember credentials
    Then I should see an alert with message containing "Sign up successful"
    When I open the login modal
    And I login with the remembered credentials
    Then I should be logged in successfully
    When I logout
    And I open the login modal
    And I login with the remembered credentials
    Then I should be logged in successfully

  # ────────────────────────────────────────────
  # Session - Additional Edge Cases
  # ────────────────────────────────────────────

  @edge-case @session @navigation
  Scenario: Login state persists after browser back navigation
    When I open the login modal
    And I login with username "hienpham" and password "123"
    And I should be logged in as "hienpham"
    And I navigate to cart page
    And I navigate back in browser
    Then I should be logged in as "hienpham"

  @edge-case @session @navigation
  Scenario: Login state persists after multiple page navigations
    When I open the login modal
    And I login with username "hienpham" and password "123"
    And I should be logged in as "hienpham"
    And I navigate to cart page
    And I navigate to homepage
    And I navigate to cart page
    Then I should be logged in as "hienpham"

  @edge-case @session @storage
  Scenario: Login fails after clearing browser storage
    When I open the login modal
    And I login with username "hienpham" and password "123"
    And I should be logged in as "hienpham"
    And I clear browser local storage
    And I refresh the page
    Then I should not be logged in
