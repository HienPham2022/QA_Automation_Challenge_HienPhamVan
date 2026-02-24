@e2e
Feature: End-to-End Purchase Flow
  As a customer of the DemoBlaze store
  I want to browse products, add them to my cart, and complete a purchase
  So that I can buy the electronics I need

  # ────────────────────────────────────────────
  # Complete Purchase Journeys
  # ────────────────────────────────────────────

  @smoke @functional
  Scenario: Complete purchase as a logged-in user
    Given I am on the DemoBlaze homepage
    When I open the login modal
    And I login with username "hienpham" and password "123"
    Then I should be logged in as "hienpham"
    # Browse and add product
    When I go back to the homepage
    And I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 1 item
    And the cart should contain product "Samsung galaxy s6"
    # Place order
    When I place an order with valid details
    Then I should see order confirmation
    And the order confirmation should contain "Amount"
    And the order confirmation should contain "4111111111111111"
    And the order confirmation should contain "John Doe"
    When I close the order confirmation
    Then I should be on the homepage

  @smoke @functional
  Scenario: Complete purchase with multiple items from different categories
    Given I am on the DemoBlaze homepage
    # Add phone
    When I select the "Phones" category
    And I click on product "Samsung galaxy s6"
    And I add the product to cart
    # Add laptop
    And I go back to the homepage
    And I select the "Laptops" category
    And I click on product "Sony vaio i5"
    And I add the product to cart
    # Verify and purchase
    And I navigate to the cart
    Then the cart should contain 2 items
    And the cart total should be 1150
    When I place an order with valid details
    Then I should see order confirmation
    When I close the order confirmation

  @functional
  Scenario: Complete purchase as a guest user (without login)
    Given I am on the DemoBlaze homepage
    When I click on product "Apple monitor 24"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 1 item
    When I place an order with valid details
    Then I should see order confirmation
    And the order confirmation should contain "Amount"
    When I close the order confirmation

  @smoke @functional
  Scenario: Purchase random product from each category
    Given I am on the DemoBlaze homepage
    # Random phone
    When I select the "Phones" category
    And I click on a random product and remember it
    And I add the product to cart
    # Random laptop
    And I go back to the homepage
    And I select the "Laptops" category
    And I click on a random product and remember it
    And I add the product to cart
    # Random monitor
    And I go back to the homepage
    And I select the "Monitors" category
    And I click on a random product and remember it
    And I add the product to cart
    # Verify and purchase
    And I navigate to the cart
    Then the cart should contain 3 items
    And the cart should contain all remembered products
    When I place an order with valid details
    Then I should see order confirmation
    When I close the order confirmation

  @functional @edge-case
  Scenario: Remove item from cart before completing purchase
    Given I am on the DemoBlaze homepage
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 2 items
    When I delete cart item at index 0
    Then the cart should contain 1 item
    When I place an order with valid details
    Then I should see order confirmation
    When I close the order confirmation

  @functional @edge-case
  Scenario: Complete purchase with minimal order details
    Given I am on the DemoBlaze homepage
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    When I place an order with minimal details
    Then I should see order confirmation
    When I close the order confirmation

  # ────────────────────────────────────────────
  # Login + Cart Persistence
  # ────────────────────────────────────────────

  @functional
  Scenario: Cart persists after login
    Given I am on the DemoBlaze homepage
    # Add product before login
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    # Now login
    And I go back to the homepage
    And I open the login modal
    And I login with username "hienpham" and password "123"
    Then I should be logged in as "hienpham"
    # Verify cart still has the item
    When I navigate to the cart
    Then the cart should have at least 1 item

  @functional
  Scenario: Product details are correct before adding to cart
    Given I am on the DemoBlaze homepage
    When I click on product "Samsung galaxy s6"
    Then the product name should contain "Samsung galaxy s6"
    And the product price should be 360
    And the product description should not be empty
