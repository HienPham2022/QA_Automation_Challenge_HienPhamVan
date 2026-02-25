@cart
Feature: Shopping Cart Management
  As a customer of the DemoBlaze store
  I want to manage products in my shopping cart
  So that I can review and purchase the items I want

  Background:
    Given I am on the DemoBlaze homepage

  # ════════════════════════════════════════════════════════════════════════════
  #                           HAPPY PATH SCENARIOS
  # ════════════════════════════════════════════════════════════════════════════

  # ────────────────────────────────────────────
  # Add to Cart - Happy Path
  # ────────────────────────────────────────────

  @smoke @happy-path
  Scenario: Add a single product to the cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 1 item
    And the cart should contain product "Samsung galaxy s6"

  @happy-path
  Scenario: Add multiple products to the cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 2 items

  @smoke @happy-path
  Scenario: Add a random product from each category to cart
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

  @happy-path
  Scenario: Product added confirmation alert appears
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    Then I should see an alert with message containing "Product added"

  @happy-path
  Scenario: Add product from Phones category
    When I select the "Phones" category
    And I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain product "Samsung galaxy s6"

  @happy-path
  Scenario: Add product from Laptops category
    When I select the "Laptops" category
    And I click on product "Sony vaio i5"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain product "Sony vaio i5"

  @happy-path
  Scenario: Add product from Monitors category
    When I select the "Monitors" category
    And I click on product "Apple monitor 24"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain product "Apple monitor 24"

  # ────────────────────────────────────────────
  # Delete from Cart - Happy Path
  # ────────────────────────────────────────────

  @happy-path
  Scenario: Delete a single item from the cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 1 item
    When I delete cart item at index 0
    Then the cart should contain 0 items

  @happy-path
  Scenario: Delete a specific item by name from cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    When I delete cart item "Samsung galaxy s6"
    Then the cart should not contain product "Samsung galaxy s6"
    And the cart should contain product "Nokia lumia 1520"

  @happy-path
  Scenario: Clear the entire cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    When I clear the cart
    Then the cart should be empty

  @happy-path
  Scenario: Delete last remaining item makes cart empty
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    When I delete cart item "Samsung galaxy s6"
    Then the cart should be empty

  # ────────────────────────────────────────────
  # Cart Calculation - Happy Path
  # ────────────────────────────────────────────

  @smoke @happy-path
  Scenario: Cart total for a single item
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart total should be 360

  @happy-path
  Scenario: Cart total for multiple items
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    Then the cart total should be 1180

  @happy-path
  Scenario: Cart total updates after deleting an item
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    And I delete cart item at index 0
    Then the cart total should be 820

  @happy-path
  Scenario: Cart total with products from different categories
    When I select the "Phones" category
    And I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I select the "Laptops" category
    And I click on product "Sony vaio i5"
    And I add the product to cart
    And I navigate to the cart
    Then the cart total should be 1150

  # ────────────────────────────────────────────
  # Category Navigation - Happy Path
  # ────────────────────────────────────────────

  @happy-path
  Scenario: Browse Phones category
    When I select the "Phones" category
    Then I should see products in the list

  @happy-path
  Scenario: Browse Laptops category
    When I select the "Laptops" category
    Then I should see products in the list

  @happy-path
  Scenario: Browse Monitors category
    When I select the "Monitors" category
    Then I should see products in the list

  @happy-path
  Scenario: Switch between categories
    When I select the "Phones" category
    Then I should see products in the list
    When I select the "Laptops" category
    Then I should see products in the list
    When I select the "Monitors" category
    Then I should see products in the list

  # ────────────────────────────────────────────
  # Product Detail - Happy Path
  # ────────────────────────────────────────────

  @happy-path
  Scenario: View product details before adding to cart
    When I click on product "Samsung galaxy s6"
    Then the product name should contain "Samsung galaxy s6"
    And the product price should be 360

  @happy-path
  Scenario: Product description is displayed
    When I click on product "Samsung galaxy s6"
    Then the product description should not be empty

  @happy-path
  Scenario: Product image is displayed
    When I click on product "Samsung galaxy s6"
    Then the product image should be visible

  # ════════════════════════════════════════════════════════════════════════════
  #                           EDGE CASE SCENARIOS
  # ════════════════════════════════════════════════════════════════════════════

  # ────────────────────────────────────────────
  # Add to Cart - Edge Cases
  # ────────────────────────────────────────────

  @edge-case
  Scenario: Add the same product multiple times
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 2 items
    And the cart total should be 720

  @edge-case
  Scenario: Add product and immediately navigate to cart
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain product "Samsung galaxy s6"

  @edge-case
  Scenario: Add multiple products in quick succession
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nexus 6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 3 items

  @edge-case
  Scenario: Cart retains items after navigating away and back
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I select the "Laptops" category
    And I navigate to the cart
    Then the cart should contain product "Samsung galaxy s6"

  @edge-case
  Scenario: Cart retains items after page refresh
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    And I refresh the page
    Then the cart should contain product "Samsung galaxy s6"

  # ────────────────────────────────────────────
  # Delete from Cart - Edge Cases
  # ────────────────────────────────────────────

  @edge-case
  Scenario: Delete item and verify remaining items order
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nexus 6"
    And I add the product to cart
    And I navigate to the cart
    When I delete cart item "Nokia lumia 1520"
    Then the cart should contain 2 items
    And the cart should contain product "Samsung galaxy s6"
    And the cart should contain product "Nexus 6"

  @edge-case
  Scenario: Delete all items one by one
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I navigate to the cart
    When I delete cart item at index 0
    Then the cart should contain 1 item
    When I delete cart item at index 0
    Then the cart should be empty

  @edge-case
  Scenario: Cart becomes empty after deleting only item
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    When I clear the cart
    Then the cart should be empty
    And the cart total should be 0

  # ────────────────────────────────────────────
  # Cart Calculation - Edge Cases
  # ────────────────────────────────────────────

  @edge-case
  Scenario: Cart total is zero when cart is empty
    When I navigate to the cart
    Then the cart total should be 0

  @edge-case
  Scenario: Cart total recalculates correctly after multiple deletions
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nexus 6"
    And I add the product to cart
    And I navigate to the cart
    When I delete cart item at index 0
    Then the cart total should be updated correctly

  @edge-case
  Scenario: Cart total with high-value items
    When I select the "Laptops" category
    And I click on product "MacBook Pro"
    And I add the product to cart
    And I navigate to the cart
    Then the cart total should be 1100

  # ────────────────────────────────────────────
  # Category Navigation - Edge Cases
  # ────────────────────────────────────────────

  @edge-case
  Scenario: Return to all products after filtering by category
    When I select the "Phones" category
    Then I should see products in the list
    When I go back to the homepage
    Then I should see products in the list

  @edge-case
  Scenario: Products persist in cart when switching categories
    When I select the "Phones" category
    And I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I select the "Laptops" category
    And I click on product "Sony vaio i5"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 2 items

  # ────────────────────────────────────────────
  # Cart Persistence - Edge Cases
  # ────────────────────────────────────────────

  @edge-case
  Scenario: Cart persists after user login
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I open the login modal
    And I login with username "hienpham" and password "123"
    And I should be logged in as "hienpham"
    And I navigate to the cart
    Then the cart should have at least 1 item

  @edge-case
  Scenario: Add to cart works for logged-in user
    When I open the login modal
    And I login with username "hienpham" and password "123"
    And I should be logged in as "hienpham"
    And I go back to the homepage
    And I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain product "Samsung galaxy s6"

  # ────────────────────────────────────────────
  # Product Detail - Edge Cases
  # ────────────────────────────────────────────

  @edge-case
  Scenario: Navigate back from product page without adding to cart
    When I click on product "Samsung galaxy s6"
    Then the product name should contain "Samsung galaxy s6"
    When I go back to the homepage
    Then I should see products in the list
    And I navigate to the cart
    Then the cart should be empty

  @edge-case
  Scenario: View different product details consecutively
    When I click on product "Samsung galaxy s6"
    Then the product name should contain "Samsung galaxy s6"
    And the product price should be 360
    When I go back to the homepage
    And I click on product "Nokia lumia 1520"
    Then the product name should contain "Nokia lumia 1520"
    And the product price should be 820

  @edge-case
  Scenario: Product price matches between detail page and cart
    When I click on product "Samsung galaxy s6"
    Then the product price should be 360
    When I add the product to cart
    And I navigate to the cart
    Then the cart total should be 360

  # ────────────────────────────────────────────
  # Empty Cart - Edge Cases
  # ────────────────────────────────────────────

  @edge-case
  Scenario: View empty cart
    When I navigate to the cart
    Then the cart should be empty

  @edge-case
  Scenario: Empty cart shows no total or zero total
    When I navigate to the cart
    Then the cart should be empty
    And the cart total should be 0

  # ────────────────────────────────────────────
  # UI State - Edge Cases
  # ────────────────────────────────────────────

  @edge-case @ui
  Scenario: Add to cart button is visible on product page
    When I click on product "Samsung galaxy s6"
    Then the add to cart button should be visible

  @edge-case @ui
  Scenario: Cart link is accessible from any page
    When I select the "Laptops" category
    And I click on a random product and remember it
    And I navigate to the cart
    Then I should be on the cart page

  @edge-case @ui
  Scenario: Delete button is visible for each cart item
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I navigate to the cart
    Then each cart item should have a delete button

  # ────────────────────────────────────────────
  # Boundary Tests
  # ────────────────────────────────────────────

  @edge-case @boundary
  Scenario: Add maximum number of items to cart (5 items)
    When I click on product "Samsung galaxy s6"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nokia lumia 1520"
    And I add the product to cart
    And I go back to the homepage
    And I click on product "Nexus 6"
    And I add the product to cart
    And I go back to the homepage
    And I select the "Laptops" category
    And I click on product "Sony vaio i5"
    And I add the product to cart
    And I go back to the homepage
    And I select the "Monitors" category
    And I click on product "Apple monitor 24"
    And I add the product to cart
    And I navigate to the cart
    Then the cart should contain 5 items
