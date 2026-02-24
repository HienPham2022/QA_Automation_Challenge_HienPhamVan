@cart
Feature: Shopping Cart Management
  As a customer of the DemoBlaze store
  I want to manage products in my shopping cart
  So that I can review and purchase the items I want

  Background:
    Given I am on the DemoBlaze homepage

  # ────────────────────────────────────────────
  # Add to Cart - Functional Scenarios
  # ────────────────────────────────────────────

  @smoke @functional
  Scenario: Add a single product to the cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 1 item
    And the cart should contain product "Samsung galaxy s6"

  @functional
  Scenario: Add multiple products to the cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 2 items

  @smoke @functional
  Scenario: Add a random product from each category
    When I select the "Phones" category
    And I click on a random product and remember it
    And I add the product to cart
    And I go back to the homepage
    And I select the "Laptops" category
    And I click on a random product and remember it
    And I add the product to cart
    And I go back to the homepage
    And I select the "Monitors" category
    And I click on a random product and remember it
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 3 items
    And the cart should contain all remembered products

  @functional
  Scenario: Product added confirmation alert appears
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    Then I should see an alert with message containing "Product added"

  # ────────────────────────────────────────────
  # Delete from Cart Scenarios
  # ────────────────────────────────────────────

  @functional
  Scenario: Delete a single item from the cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 1 item
    When I delete cart item at index 0
    Then the cart should contain 0 items

  @functional
  Scenario: Delete a specific item by name
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    When I delete cart item "Samsung galaxy s6"
    Then the cart should not contain product "Samsung galaxy s6"
    And the cart should contain product "Nokia lumia 1520"

  @functional
  Scenario: Clear the entire cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    When I clear the cart
    Then the cart should be empty

  # ────────────────────────────────────────────
  # Cart Calculation Scenarios
  # ────────────────────────────────────────────

  @functional
  Scenario: Cart total for a single item
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart total should be 360

  @functional
  Scenario: Cart total for multiple items
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    Then the cart total should be 1180

  @functional
  Scenario: Cart total updates after deleting an item
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    And I delete cart item at index 0
    Then the cart total should be 820

  # ────────────────────────────────────────────
  # Category Navigation Scenarios
  # ────────────────────────────────────────────

  @functional
  Scenario: Browse Phones category
    When I select the "Phones" category
    Then I should see products in the list

  @functional
  Scenario: Browse Laptops category
    When I select the "Laptops" category
    Then I should see products in the list

  @functional
  Scenario: Browse Monitors category
    When I select the "Monitors" category
    Then I should see products in the list

  # ────────────────────────────────────────────
  # Product Detail Scenarios
  # ────────────────────────────────────────────

  @functional
  Scenario: View product details before adding to cart
    When I click on product "Samsung galaxy s6"
    Then the product name should contain "Samsung galaxy s6"
    And the product price should be 360
