# E-Commerce Services Dependency 

## Overview

This repository contains two services for an e-commerce application based on the Spring framework. These services provide functionality related to the user's cart and wishlist.

### If you have any doubt or find a bug so don't hesitate contact to me because it help me to improve this dependency
Email:  deeputrivedi0409@gmail.com 

## Services

### 1. CartService

The `CartService` is responsible for managing the user's shopping cart. It offers the following functionalities:

- **addProductInCart(userId, productId, quantity):**
  - Adds a product to the user's cart with the specified quantity.

- **increaseProductQuantityInCartByOne(userId, productId):**
  - Increases the quantity of a specific product in the user's cart by one.

- **decreaseProductQuantityInCartByOne(userId, productId):**
  - Decreases the quantity of a specific product in the user's cart by one.

- **setProductQuantityInCartByNumber(userId, productId, quantity):**
  - Sets the quantity of a specific product in the user's cart to a specified number.

- **clearAllProductFromCart(userId):**
  - Removes all products from the user's cart.

- **removeIndividualFromCart(userId, productId):**
  - Removes a specific product from the user's cart.

- **getCartData(userId):**
  - Retrieves the user's cart data.

### 2. FavouriteService

The `FavouriteService` manages the user's wishlist. It provides the following functionalities:

- **addProductInFavourite(userId, productId):**
  - Adds a product to the user's wishlist.

- **clearAllProductFromFavourite(userId):**
  - Removes all products from the user's wishlist.

- **removeIndividualFromFavourite(userId, productId):**
  - Removes a specific product from the user's wishlist.

- **getFavouriteData(userId):**
  - Retrieves the user's wishlist data.
 
## 3. ProductService

The `ProductService` handles operations related to products, offering the following functionalities:

- **addProductInDatabase(productModal):**
  - Adds a product to the database.

- **getOneProductFromDatabase(productId):**
  - Retrieves details of a specific product from the database.

- **getAllProductFromDatabase():**
  - Retrieves details of all products from the database.

- **getProductBySearch(searchText):**
  - Retrieves a list of products from the database based on a search query.
  


## Directory Structure

```plaintext
service:
  - CartService:
    - addProductInCart
    - increaseProductQuantityInCartByOne
    - decreaseProductQuantityInCartByOne
    - setProductQuantityInCartByNumber
    - clearAllProductFromCart
    - removeIndividualFromCart
    - getCartData
  - FavouriteService:
    - addProductInFavourite
    - clearAllProductFromFavourite
    - removeIndividualFromFavourite
    - getFavouriteData
  - ProductService:
    - addProductInDatabase
    - getOneProductFromDatabase
    - getAllProductFromDatabase
    - getProductBySearch
  

```

## How to install on your project:

```
IntelliJ -> File Option -> Project Structure -> Modules (Dependdency) -> click add + icon to add dependency
```
```
Other IDE so please check on google How to add JAR 
```

## Don't forget to add this annotation in main class

```java
import org.springframework.context.annotation.ComponentScan;

@ComponentScan("com.ecommerce.*")
```

## How to use

you have to create an object of CartService:
Normal Way
```java
CartService cartService=new CartServiceImplementation
```
Springboot
```java
@Autowired
CartServiceImplementation cartServicImplementation;
```


## Future Enhancements

In the future, additional features will be added, including:

- **Authentication and Authorization:**
  - Secure the services with authentication and authorization mechanisms to protect user data.

- **Caching:**
  - Implement caching mechanisms to optimize and improve the performance of the services.

The `FilterService` manages various filters to enhance the user's shopping experience. It provides the following functionalities:

- **applyCategoryFilter(category):**
  - Filters products based on the specified category.

- **applyPriceRangeFilter(minPrice, maxPrice):**
  - Filters products within the specified price range.

- **applyRatingFilter(minRating):**
  - Filters products with a rating equal to or above the specified minimum.

- **Dynamic Filters:**
  - Implement dynamic filters that adjust based on user preferences and browsing history.
    
- **placeOrder(userId, productIds):**
  - Places an order for the specified products.

- **trackOrder(orderId):**
  - Provides real-time tracking information for a specific order.

- **cancelOrder(orderId):**
  - Allows users to cancel a placed order.
 
- **Order History:**
  - Implement a feature for users to view their order history and reorder previous purchases.

- **Automated Order Tracking:**
  - Integrate automated notifications for real-time order tracking.
 
   
     




