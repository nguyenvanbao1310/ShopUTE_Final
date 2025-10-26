-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: shopute
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `address` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `province` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `phone` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (5,27,'219/4 Lê Văn Chí, Phường Thủ Đức, Thành phố Hồ Chí Minh','219/4 Lê Văn Chí','Phường Thủ Đức','Thành phố Hồ Chí Minh','2025-09-26 22:59:28','2025-10-27 00:38:21',0,'0335585657'),(6,27,'12 Nguyễn Huệ, Phường An Hội Tây, Thành phố Hồ Chí Minh','12 Nguyễn Huệ','Phường An Hội Tây','Thành phố Hồ Chí Minh','2025-10-26 23:21:18','2025-10-27 00:38:21',0,'0768640217'),(7,27,'45 Trần Hưng Đạo, Phường Bà Rịa, Thành phố Hồ Chí Minh','45 Trần Hưng Đạo','Phường Bà Rịa','Thành phố Hồ Chí Minh','2025-10-26 23:21:40','2025-10-27 00:38:21',0,'0707751852');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cancelrequests`
--

DROP TABLE IF EXISTS `cancelrequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancelrequests` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `orderId` int unsigned NOT NULL,
  `userId` int unsigned DEFAULT NULL,
  `reason` text NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancelrequests`
--

LOCK TABLES `cancelrequests` WRITE;
/*!40000 ALTER TABLE `cancelrequests` DISABLE KEYS */;
INSERT INTO `cancelrequests` VALUES (1,17,3,'abc','PENDING','2025-10-15 17:08:54','2025-10-15 17:08:54'),(2,28,3,'abc','PENDING','2025-10-19 20:32:03','2025-10-19 20:32:03');
/*!40000 ALTER TABLE `cancelrequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cartId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `selected` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cartId` (`cartId`),
  KEY `productId` (`productId`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (10,2,1,1,1,'2025-10-21 18:18:05','2025-10-21 18:18:05'),(18,15,1,1,1,'2025-10-27 00:45:33','2025-10-27 00:45:33'),(19,15,2,3,1,'2025-10-27 00:45:42','2025-10-27 00:46:45'),(23,15,5,1,1,'2025-10-27 00:46:45','2025-10-27 00:46:45');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `deviceId` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_carts_deviceId` (`deviceId`),
  UNIQUE KEY `uniq_carts_userId` (`userId`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (2,3,NULL,'2025-09-26 22:08:27','2025-09-26 22:08:27'),(4,NULL,'cc972564-c512-470b-bccf-2eec13ddbc8b','2025-09-26 23:00:25','2025-09-26 23:00:25'),(5,NULL,'57855e37-a149-46aa-a666-dfb2473e7537','2025-10-21 14:10:29','2025-10-21 14:10:29'),(7,21,NULL,'2025-10-26 08:35:47','2025-10-26 08:35:47'),(9,NULL,'086e6a29-4c8e-402b-a2cf-390590fc402b','2025-10-26 21:28:51','2025-10-26 21:28:51'),(10,24,NULL,'2025-10-26 21:29:18','2025-10-26 21:29:18'),(15,27,NULL,'2025-10-26 23:06:55','2025-10-26 23:06:55'),(19,NULL,'387fb8f6-4b83-409d-812a-bb39e9d9d947','2025-10-27 00:07:01','2025-10-27 00:07:01'),(20,28,NULL,'2025-10-27 00:07:42','2025-10-27 00:07:42'),(22,NULL,'2ce017c0-225c-4107-b495-c821f592c21d','2025-10-27 00:20:12','2025-10-27 00:20:12'),(23,30,NULL,'2025-10-27 00:23:55','2025-10-27 00:23:55'),(25,NULL,'5e149bca-d9bf-4329-9f7a-565b64352347','2025-10-27 00:31:11','2025-10-27 00:31:11');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `parentId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Laptop',NULL,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(2,'Desktop PC',NULL,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(3,'Linh kiện PC',NULL,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(4,'Phụ kiện',NULL,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(5,'Màn hình',NULL,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(6,'Laptop Gaming',1,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(7,'Laptop Văn phòng',1,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(8,'MacBook',1,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(9,'CPU',3,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(10,'Mainboard',3,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(11,'RAM',3,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(12,'Ổ cứng SSD/HDD',3,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(13,'Card đồ hoạ (GPU)',3,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(14,'Chuột',4,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(15,'Bàn phím',4,'2025-09-02 21:51:20','2025-09-02 21:51:20'),(16,'Tai nghe',4,'2025-09-02 21:51:20','2025-09-02 21:51:20');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `userId` int DEFAULT NULL,
  `type` enum('PERCENT','AMOUNT') NOT NULL DEFAULT 'PERCENT',
  `value` decimal(10,2) NOT NULL,
  `minOrderAmount` decimal(14,2) DEFAULT NULL,
  `maxDiscountValue` decimal(14,2) DEFAULT NULL,
  `expiresAt` datetime DEFAULT NULL,
  `isUsed` tinyint(1) NOT NULL DEFAULT '0',
  `usedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `userId` (`userId`),
  CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'SALE10',27,'PERCENT',10.00,500000.00,100000.00,'2026-01-01 06:59:59',0,NULL,'2025-10-26 01:45:10','2025-10-26 01:45:10'),(2,'FIX30K',27,'AMOUNT',30000.00,150000.00,NULL,'2025-12-01 06:59:59',1,'2025-10-26 23:22:59','2025-10-26 01:45:28','2025-10-26 23:22:59'),(3,'VIP20',3,'PERCENT',20.00,1000000.00,500000.00,'2026-01-16 06:59:59',1,'2025-10-26 01:50:06','2025-10-26 01:45:48','2025-10-26 01:50:06'),(4,'FEST50K',3,'AMOUNT',50000.00,300000.00,NULL,'2025-12-25 06:59:00',0,NULL,'2025-10-26 01:45:57','2025-10-26 23:54:53'),(6,'MC01',NULL,'PERCENT',20.00,1000000.00,2000000.00,'2025-11-24 23:53:00',0,NULL,'2025-10-26 23:53:59','2025-10-26 23:54:32');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `receiver_id` int NOT NULL,
  `receiver_role` enum('user','admin') NOT NULL,
  `type` enum('ORDER','COMMENT','REVIEW','SYSTEM','LOYALTY') NOT NULL DEFAULT 'SYSTEM',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `action_url` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `send_email` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (26,3,'user','ORDER','?️ Đơn hàng mới tạo','Bạn vừa đặt đơn hàng #ORD1761413793862 thành công.','/orders/40',1,1,'2025-10-26 00:36:33'),(27,21,'admin','ORDER','? Đơn hàng mới','Le vừa đặt đơn hàng #ORD1761413793862.','/admin/orders/40',1,1,'2025-10-26 00:36:39'),(28,3,'user','ORDER','?️ Đơn hàng mới tạo','Bạn vừa đặt đơn hàng #ORD1761413911718 thành công.','/orders/41',1,1,'2025-10-26 00:38:31'),(29,21,'admin','ORDER','? Đơn hàng mới','Le vừa đặt đơn hàng #ORD1761413911718.','/admin/orders/41',1,1,'2025-10-26 00:38:36'),(30,3,'user','ORDER','?️ Đơn hàng mới tạo','Bạn vừa đặt đơn hàng #ORD1761418206750 thành công.','/orders/42',1,1,'2025-10-26 01:50:06'),(31,21,'admin','ORDER','? Đơn hàng mới','Le vừa đặt đơn hàng #ORD1761418206750.','/admin/orders/42',1,1,'2025-10-26 01:50:12'),(32,3,'user','ORDER','?️ Đơn hàng mới tạo','Bạn vừa đặt đơn hàng #ORD1761442597809 thành công.','/orders/43',1,1,'2025-10-26 08:36:37'),(33,21,'admin','ORDER','? Đơn hàng mới','Le Nhan vừa đặt đơn hàng #ORD1761442597809.','/admin/orders/43',1,1,'2025-10-26 08:36:37'),(34,22,'admin','ORDER','? Đơn hàng mới','Le Nhan vừa đặt đơn hàng #ORD1761442597809.','/admin/orders/43',0,1,'2025-10-26 08:36:37'),(35,3,'user','ORDER','?️ Đơn hàng mới tạo','Bạn vừa đặt đơn hàng #ORD1761442632393 thành công.','/orders/44',1,1,'2025-10-26 08:37:12'),(36,21,'admin','ORDER','? Đơn hàng mới','Le Nhan vừa đặt đơn hàng #ORD1761442632393.','/admin/orders/44',0,1,'2025-10-26 08:37:12'),(37,22,'admin','ORDER','? Đơn hàng mới','Le Nhan vừa đặt đơn hàng #ORD1761442632393.','/admin/orders/44',0,1,'2025-10-26 08:37:12'),(39,21,'admin','ORDER','? Đơn hàng mới','Le Nhan vừa đặt đơn hàng #ORD1761443878904.','/admin/orders/45',0,1,'2025-10-26 08:57:59'),(40,22,'admin','ORDER','? Đơn hàng mới','Le Nhan vừa đặt đơn hàng #ORD1761443878904.','/admin/orders/45',0,1,'2025-10-26 08:57:59'),(41,21,'admin','ORDER','? Đơn hàng mới','Bao Nguyen vừa đặt đơn hàng #ORD1761495779907.','/admin/orders',0,1,'2025-10-26 23:22:59'),(42,27,'user','ORDER','?️ Đơn hàng mới tạo','Bạn vừa đặt đơn hàng #ORD1761495779907 thành công.','/orders',1,1,'2025-10-26 23:22:59'),(43,22,'admin','ORDER','? Đơn hàng mới','Bao Nguyen vừa đặt đơn hàng #ORD1761495779907.','/admin/orders',0,1,'2025-10-26 23:22:59'),(44,23,'admin','ORDER','? Đơn hàng mới','Bao Nguyen vừa đặt đơn hàng #ORD1761495779907.','/admin/orders',0,1,'2025-10-26 23:22:59'),(47,21,'admin','ORDER','? Đơn hàng mới','Bao Nguyen vừa đặt đơn hàng #ORD1761495836715.','/admin/orders',0,1,'2025-10-26 23:23:56'),(48,22,'admin','ORDER','? Đơn hàng mới','Bao Nguyen vừa đặt đơn hàng #ORD1761495836715.','/admin/orders',0,1,'2025-10-26 23:23:56'),(50,23,'admin','ORDER','? Đơn hàng mới','Bao Nguyen vừa đặt đơn hàng #ORD1761495836715.','/admin/orders',0,1,'2025-10-26 23:23:56'),(51,21,'admin','ORDER','? Đơn hàng mới','Baooo Nguyenn vừa đặt đơn hàng #ORD1761500604851.','/admin/orders',0,1,'2025-10-27 00:43:24'),(53,22,'admin','ORDER','? Đơn hàng mới','Baooo Nguyenn vừa đặt đơn hàng #ORD1761500604851.','/admin/orders',0,1,'2025-10-27 00:43:24'),(54,23,'admin','ORDER','? Đơn hàng mới','Baooo Nguyenn vừa đặt đơn hàng #ORD1761500604851.','/admin/orders',0,1,'2025-10-27 00:43:24'),(55,28,'admin','ORDER','? Đơn hàng mới','Baooo Nguyenn vừa đặt đơn hàng #ORD1761500604851.','/admin/orders',0,1,'2025-10-27 00:43:24');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `subtotal` decimal(14,2) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `productId` (`productId`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (73,40,1,1,27200000.00,'2025-10-26 00:36:33','2025-10-26 00:36:33'),(74,41,1,1,27200000.00,'2025-10-26 00:38:31','2025-10-26 00:38:31'),(75,42,1,1,27200000.00,'2025-10-26 01:50:06','2025-10-26 01:50:06'),(76,43,1,1,27200000.00,'2025-10-26 08:36:37','2025-10-26 08:36:37'),(77,44,1,1,27200000.00,'2025-10-26 08:37:12','2025-10-26 08:37:12'),(78,45,1,1,27200000.00,'2025-10-26 08:57:58','2025-10-26 08:57:58'),(79,46,6,1,65000000.00,'2025-10-26 23:22:59','2025-10-26 23:22:59'),(80,46,11,2,51980000.00,'2025-10-26 23:22:59','2025-10-26 23:22:59'),(81,47,11,1,25990000.00,'2025-10-26 23:23:56','2025-10-26 23:23:56'),(82,48,1,2,54400000.00,'2025-10-27 00:43:24','2025-10-27 00:43:24'),(83,48,2,1,22000000.00,'2025-10-27 00:43:24','2025-10-27 00:43:24');
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `code` varchar(30) NOT NULL,
  `totalAmount` decimal(14,2) NOT NULL,
  `paymentMethod` varchar(30) DEFAULT NULL,
  `paymentStatus` enum('UNPAID','PAID','REFUNDED') NOT NULL DEFAULT 'UNPAID',
  `note` text,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PENDING','CONFIRMED','PREPARING','SHIPPED','COMPLETED','CANCELLED','CANCEL_REQUESTED') NOT NULL DEFAULT 'PENDING',
  `deliveryAddress` varchar(255) DEFAULT NULL,
  `discountAmount` decimal(14,2) DEFAULT NULL,
  `shippingFee` decimal(14,2) DEFAULT NULL,
  `finalAmount` decimal(14,2) DEFAULT NULL,
  `usedPoints` int unsigned NOT NULL DEFAULT '0',
  `pointsDiscountAmount` decimal(14,2) DEFAULT NULL,
  `shippingMethodId` int unsigned DEFAULT NULL,
  `couponId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_orders_userId` (`userId`),
  KEY `orders_shippingMethodId_foreign_idx` (`shippingMethodId`),
  KEY `orders_couponId_foreign_idx` (`couponId`),
  CONSTRAINT `fk_orders_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_couponId_foreign_idx` FOREIGN KEY (`couponId`) REFERENCES `coupons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_shippingMethodId_foreign_idx` FOREIGN KEY (`shippingMethodId`) REFERENCES `shipping_methods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (40,3,'ORD1761413793862',27200000.00,'COD','UNPAID',NULL,'2025-09-26 00:36:33','2025-10-26 02:00:00','COMPLETED','219/4 Lê Văn Chí, Phường Thủ Đức, Thành phố Hồ Chí Minh',0.00,15000.00,27215000.00,0,0.00,1,NULL),(41,3,'ORD1761413911718',27200000.00,'COD','UNPAID',NULL,'2025-09-26 00:38:31','2025-10-26 02:00:00','COMPLETED','219/4 Lê Văn Chí, Phường Thủ Đức, Thành phố Hồ Chí Minh',0.00,15000.00,27215000.00,0,0.00,1,NULL),(42,3,'ORD1761418206750',27200000.00,'COD','UNPAID',NULL,'2025-10-26 01:50:06','2025-10-26 09:00:00','CONFIRMED','219/4 Lê Văn Chí, Phường Thủ Đức, Thành phố Hồ Chí Minh',500000.00,10000.00,26710000.00,0,0.00,2,3),(43,3,'ORD1761442597809',27200000.00,'COD','UNPAID',NULL,'2025-09-26 08:36:37','2025-10-26 21:30:00','COMPLETED','219/4 Lê Văn Chí, Phường Thủ Đức, Thành phố Hồ Chí Minh',0.00,15000.00,27215000.00,0,0.00,1,NULL),(44,3,'ORD1761442632393',27200000.00,'COD','UNPAID',NULL,'2025-10-26 08:37:12','2025-10-26 21:30:00','CONFIRMED','219/4 Lê Văn Chí, Phường Thủ Đức, Thành phố Hồ Chí Minh',0.00,15000.00,27215000.00,0,0.00,1,NULL),(45,3,'ORD1761443878904',27200000.00,'COD','UNPAID',NULL,'2025-10-26 08:57:58','2025-10-26 21:30:00','COMPLETED','219/4 Lê Văn Chí, Phường Thủ Đức, Thành phố Hồ Chí Minh',0.00,15000.00,27215000.00,0,0.00,1,NULL),(46,27,'ORD1761495779907',116980000.00,'COD','UNPAID',NULL,'2025-10-26 23:22:59','2025-10-26 23:22:59','COMPLETED','45 Trần Hưng Đạo, Phường Bà Rịa, Thành phố Hồ Chí Minh',30000.00,15000.00,116965000.00,0,0.00,1,2),(47,27,'ORD1761495836715',25990000.00,'COD','UNPAID',NULL,'2025-10-26 23:23:56','2025-10-26 23:25:23','CANCELLED','219/4 Lê Văn Chí, Phường Thủ Đức, Thành phố Hồ Chí Minh',0.00,10000.00,26000000.00,0,0.00,2,NULL),(48,27,'ORD1761500604851',76400000.00,'COD','UNPAID',NULL,'2025-10-27 00:43:24','2025-10-27 00:43:24','PENDING','12 Nguyễn Huệ, Phường An Hội Tây, Thành phố Hồ Chí Minh',2000000.00,15000.00,74400000.00,15,15000.00,1,6);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_discounts`
--

DROP TABLE IF EXISTS `product_discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_discounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `discountPercent` decimal(5,2) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `startsAt` datetime DEFAULT NULL,
  `endsAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `productId` (`productId`),
  CONSTRAINT `product_discounts_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_discounts`
--

LOCK TABLES `product_discounts` WRITE;
/*!40000 ALTER TABLE `product_discounts` DISABLE KEYS */;
INSERT INTO `product_discounts` VALUES (1,1,15.00,1,'2025-08-01 10:00:00','2025-10-31 23:59:59','2025-09-03 15:35:34','2025-09-03 15:35:34'),(2,3,20.00,1,'2025-09-01 00:00:00',NULL,'2025-09-03 15:35:34','2025-09-03 15:35:34'),(3,5,5.50,1,'2025-08-15 09:30:00','2025-09-30 23:59:59','2025-09-03 15:35:34','2025-09-03 15:35:34'),(4,2,10.00,1,'2025-07-01 00:00:00','2025-07-31 23:59:59','2025-09-03 15:35:34','2025-09-03 15:35:34'),(5,4,25.00,1,'2025-06-10 12:00:00','2025-08-20 18:00:00','2025-09-03 15:35:34','2025-09-03 15:35:34'),(6,6,30.00,1,'2025-10-01 00:00:00','2025-10-10 23:59:59','2025-09-03 15:35:34','2025-09-03 15:35:34'),(7,7,8.00,1,'2025-11-15 00:00:00','2025-12-15 23:59:59','2025-09-03 15:35:34','2025-09-03 15:35:34'),(8,8,50.00,0,'2025-09-01 00:00:00',NULL,'2025-09-03 15:35:34','2025-09-03 15:35:34'),(9,9,12.50,0,'2025-08-25 14:00:00','2025-09-25 14:00:00','2025-09-03 15:35:34','2025-09-03 15:35:34');
/*!40000 ALTER TABLE `product_discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `url` varchar(500) NOT NULL,
  `position` int NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'https://example.com/images/prod1-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(2,1,'https://example.com/images/prod1-side.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(3,1,'https://example.com/images/prod1-keyboard.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(4,1,'https://example.com/images/prod1-port.jpg',3,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(5,2,'https://example.com/images/prod2-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(6,2,'https://example.com/images/prod2-top.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(7,2,'https://example.com/images/prod2-side.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(8,3,'https://example.com/images/prod3-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(9,3,'https://example.com/images/prod3-keyboard.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(10,3,'https://example.com/images/prod3-screen.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(11,4,'https://example.com/images/prod4-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(12,4,'https://example.com/images/prod4-side.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(13,4,'https://example.com/images/prod4-back.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(14,4,'https://example.com/images/prod4-keyboard.jpg',3,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(15,5,'https://example.com/images/prod5-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(16,5,'https://example.com/images/prod5-top.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(17,5,'https://example.com/images/prod5-side.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(18,6,'https://example.com/images/prod6-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(19,6,'https://example.com/images/prod6-keyboard.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(20,6,'https://example.com/images/prod6-screen.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(21,6,'https://example.com/images/prod6-port.jpg',3,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(22,7,'https://example.com/images/prod7-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(23,7,'https://example.com/images/prod7-top.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(24,7,'https://example.com/images/prod7-side.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(25,8,'https://example.com/images/prod8-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(26,8,'https://example.com/images/prod8-side.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(27,8,'https://example.com/images/prod8-back.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(28,9,'https://example.com/images/prod9-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(29,9,'https://example.com/images/prod9-keyboard.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(30,9,'https://example.com/images/prod9-side.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(31,9,'https://example.com/images/prod9-top.jpg',3,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(32,10,'https://example.com/images/prod10-main.jpg',0,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(33,10,'https://example.com/images/prod10-side.jpg',1,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(34,10,'https://example.com/images/prod10-back.jpg',2,'2025-09-02 21:56:54','2025-09-02 21:56:54'),(42,11,'uploads/products/file-1761489464790-113183614.png',1,'2025-10-26 21:37:44','2025-10-26 21:37:44'),(46,11,'uploads/products/file-1761489571435-725116879.png',2,'2025-10-26 21:39:31','2025-10-26 21:39:31'),(48,13,'uploads/products/file-1761493226754-228741284.png',1,'2025-10-26 22:40:26','2025-10-26 22:40:26'),(51,13,'uploads/products/file-1761493241629-642612939.png',2,'2025-10-26 22:40:41','2025-10-26 22:40:41'),(52,13,'uploads/products/file-1761493241631-414242236.png',3,'2025-10-26 22:40:41','2025-10-26 22:40:41'),(53,13,'uploads/products/file-1761493241633-422906355.png',4,'2025-10-26 22:40:41','2025-10-26 22:40:41');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(12,2) NOT NULL,
  `viewCount` int NOT NULL DEFAULT '0',
  `stock` int NOT NULL DEFAULT '0',
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `thumbnailUrl` varchar(500) DEFAULT NULL,
  `categoryId` int NOT NULL,
  `brand` varchar(100) NOT NULL,
  `cpu` varchar(100) NOT NULL,
  `ram` varchar(50) NOT NULL,
  `storage` varchar(100) NOT NULL,
  `gpu` varchar(100) NOT NULL,
  `screen` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Asus ROG Strix G15','Laptop gaming hiệu năng cao với RTX 3060',32000000.00,58,10,'ACTIVE','uploads/products/Asus.jpg',6,'Asus','AMD Ryzen 7 6800H','16GB','1TB SSD','NVIDIA RTX 3060','15.6\" FHD 144Hz','2025-09-02 21:52:17','2025-10-27 00:45:21'),(2,'MSI Katana GF66','Laptop gaming giá rẻ với RTX 3050',22000000.00,15,17,'ACTIVE','uploads/products/MSIGF66.jpg',6,'MSI','Intel Core i5-11400H','8GB','512GB SSD','NVIDIA RTX 3050','15.6\" FHD 144Hz','2025-09-02 21:52:17','2025-10-27 00:46:35'),(3,'Dell Inspiron 14','Laptop văn phòng gọn nhẹ',16000000.00,8,25,'ACTIVE','uploads/products/Dell14.jpg',7,'Dell','Intel Core i5-1235U','8GB','512GB SSD','Intel Iris Xe','14\" FHD','2025-09-02 21:52:17','2025-10-27 00:08:12'),(4,'HP Envy 13','Laptop mỏng nhẹ, pin lâu cho văn phòng',20000000.00,16,20,'ACTIVE','uploads/products/HPEnvy13.jpg',7,'HP','Intel Core i7-1165G7','16GB','512GB SSD','Intel Iris Xe','13.3\" FHD','2025-09-02 21:52:17','2025-10-27 00:08:42'),(5,'MacBook Air M2 2022','MacBook Air với chip Apple M2',29000000.00,21,10,'ACTIVE','uploads/products/MacBookAirM2.jpg',8,'Apple','Apple M2','8GB','256GB SSD','10-core GPU','13.6\" Liquid Retina','2025-09-02 21:52:17','2025-10-27 00:46:40'),(6,'MacBook Pro 16 M1 Max','MacBook Pro hiệu năng cao cho dân chuyên nghiệp',65000000.00,36,4,'ACTIVE','uploads/products/MacbookPro16.jpg',8,'Apple','Apple M1 Max','32GB','1TB SSD','32-core GPU','16.2\" Liquid Retina XDR','2025-09-02 21:52:17','2025-10-27 00:35:57'),(7,'Logitech G102','Chuột gaming phổ thông RGB',500000.00,0,50,'ACTIVE','uploads/products/LogitechG102.jpg',14,'Logitech','N/A','N/A','N/A','N/A','N/A','2025-09-02 21:52:17','2025-09-02 21:52:17'),(8,'Keychron K2','Bàn phím cơ Bluetooth hot nhất hiện nay',1800000.00,0,30,'ACTIVE','uploads/products/KeychronK2.jpg',15,'Keychron','N/A','N/A','N/A','N/A','N/A','2025-09-02 21:52:17','2025-09-02 21:52:17'),(9,'Sony WH-1000XM5','Tai nghe chống ồn cao cấp',8000000.00,0,15,'ACTIVE','uploads/products/sony-wh1000xm5.jpg',16,'Sony','N/A','N/A','N/A','N/A','N/A','2025-09-02 21:52:17','2025-09-02 21:52:17'),(10,'LG UltraGear 27GL850','Màn hình gaming 2K 144Hz',9000000.00,2,12,'ACTIVE','uploads/products/LGUltraGear27GL850.jpg',5,'LG','N/A','N/A','N/A','N/A','27\" QHD Nano IPS 144Hz','2025-09-02 21:52:17','2025-10-04 10:30:52'),(11,'Lenovo LOQ 15IAX9','Laptop gaming hiệu năng cao, tản nhiệt tốt.',25990000.00,33,52,'ACTIVE','uploads/products/Lenovo.jpg',3,'Lenovo','Intel Core i5-12450HX','16GB DDR5','512GB NVMe SSD','NVIDIA RTX 3050 6GB','15.6\" FHD 144Hz','2025-09-03 03:28:55','2025-10-27 00:33:21'),(13,'Macbook','123123',31999991.00,6,10,'ACTIVE','uploads/products/file-1761493226732-875358810.png',1,'Asus','Intel Core i7-1165G7','16GB DDR5','512GB NVMe SSD','NVIDIA RTX 3060','15.6\" FHD 144Hz','2025-10-26 22:40:26','2025-10-27 00:02:19');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating_replies`
--

DROP TABLE IF EXISTS `rating_replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating_replies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ratingId` int unsigned NOT NULL,
  `adminUserId` int unsigned DEFAULT NULL,
  `message` text NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_rating_replies_rating_time` (`ratingId`,`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating_replies`
--

LOCK TABLES `rating_replies` WRITE;
/*!40000 ALTER TABLE `rating_replies` DISABLE KEYS */;
INSERT INTO `rating_replies` VALUES (1,3,NULL,'ádasdsad','2025-10-26 14:46:55.645951','2025-10-26 14:46:55.645951'),(2,3,NULL,'hhhhh','2025-10-26 15:10:40.583058','2025-10-26 15:10:40.583058'),(3,2,NULL,'oke','2025-10-26 17:06:53.449278','2025-10-26 17:06:53.449278'),(4,2,NULL,'ok','2025-10-26 18:03:12.292858','2025-10-26 18:03:12.292858'),(5,25,NULL,'Oke','2025-10-27 00:18:05.864112','2025-10-27 00:18:05.864112'),(6,25,NULL,'Cảm ơn bạn nhá','2025-10-27 00:18:20.993222','2025-10-27 00:18:20.993222'),(7,25,NULL,'Oke','2025-10-27 00:20:47.480241','2025-10-27 00:20:47.480241'),(8,25,NULL,'1234','2025-10-27 00:21:04.871345','2025-10-27 00:21:04.871345'),(9,31,NULL,'Cảm ơn bạn vì đã quan tâm shop :D','2025-10-27 00:32:21.110074','2025-10-27 00:32:21.110074');
/*!40000 ALTER TABLE `rating_replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `userId` int NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `comment` text,
  `containsProfanity` tinyint(1) NOT NULL DEFAULT '0',
  `moderationStatus` enum('PENDING','REVIEWED') NOT NULL DEFAULT 'REVIEWED',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `userId` (`userId`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (25,1,22,5.0,'Tuyệt vời',0,'REVIEWED','2025-10-26 23:15:23','2025-10-26 23:15:23'),(26,1,24,4.0,'Sản phẩm tốt',0,'REVIEWED','2025-10-26 23:15:23','2025-10-26 23:15:23'),(27,2,22,3.5,'Ổn',0,'REVIEWED','2025-10-26 23:15:23','2025-10-26 23:15:23'),(29,3,27,2.0,'Không như mong đợi',0,'REVIEWED','2025-10-26 23:15:23','2025-10-26 23:15:23'),(30,3,24,3.0,'Bình thường',0,'REVIEWED','2025-10-26 23:15:23','2025-10-26 23:15:23'),(31,6,27,4.0,'Quá tuyệt vời',0,'REVIEWED','2025-10-27 00:30:30','2025-10-27 00:30:30'),(33,6,27,2.0,'dm',1,'PENDING','2025-10-27 00:35:49','2025-10-27 00:35:49');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20250827070512-create-users.js'),('20250902144705-create-categories.js'),('20250902144725-create-products.js'),('20250902144734-create-product-images.js'),('20250902153500-create-orders.js'),('20250902153518-create-order-details.js'),('20250903065510-create-product-discounts.js'),('20250904153920-create-ratings.js'),('20250915140622-create-carts.js'),('20250915140629-create-cart-items.js'),('20250915151940-alter-carts-unique-indexes.js'),('20250916033655-add-userid-fk-to-orders.js'),('20250916070149-alter-status-in--orders.js'),('20250916142240-create-address-model.js'),('20250916143724-addAddress_defautAtrs.js'),('20250916155058-alterUser_UserAtrs.js'),('20250917045940-alterAddress-addPhone.js'),('20250917084801-update-order-status-enum.js'),('20250917093201-alterOrder_addDeliveryAddress.js'),('20250918090540-create-cancel-requests.js'),('20250921090000-create-coupons.js'),('20250921090500-add-loyaltyPoints-to-users.js'),('20250924143701-create-wishlist.js'),('20250925091437-create-viewed-product.js'),('20250926164020-create-voucher.js'),('20250926164038-create-shipping-method.js'),('20250926164223-alter-orders.js'),('20250928035205-alter_vocher_addMax.js'),('20251015090000-alter-ratings-add-active-and-moderation.js'),('20251016090000-drop-isActive-from-ratings.js'),('20251016100645-create-Notifications.js'),('20251017000000-alter_coupons_addMaxDiscountValue.js'),('20251017020000-alter-users-add-isActive.js'),('20251025175340-update-voucherId-to-couponId.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_methods`
--

DROP TABLE IF EXISTS `shipping_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_methods` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `fee` decimal(10,2) NOT NULL,
  `estimatedDays` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_methods`
--

LOCK TABLES `shipping_methods` WRITE;
/*!40000 ALTER TABLE `shipping_methods` DISABLE KEYS */;
INSERT INTO `shipping_methods` VALUES (1,'Shopee Express - Nhanh',15000.00,'1-2 ngày','2025-09-26 16:46:20','2025-09-26 16:46:20'),(2,'Shopee Express - Tiết Kiệm',10000.00,'3-5 ngày','2025-09-26 16:46:20','2025-09-26 16:46:20'),(3,'Giao Hàng Tiết Kiệm',12000.00,'2-4 ngày','2025-09-26 16:46:20','2025-09-26 16:46:20'),(4,'Giao Hàng Nhanh',18000.00,'1-3 ngày','2025-09-26 16:46:20','2025-09-26 16:46:20');
/*!40000 ALTER TABLE `shipping_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_coupons`
--

DROP TABLE IF EXISTS `user_coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `couponId` int NOT NULL,
  `usedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_coupon` (`userId`,`couponId`),
  KEY `couponId` (`couponId`),
  CONSTRAINT `user_coupons_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_coupons_ibfk_2` FOREIGN KEY (`couponId`) REFERENCES `coupons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_coupons`
--

LOCK TABLES `user_coupons` WRITE;
/*!40000 ALTER TABLE `user_coupons` DISABLE KEYS */;
INSERT INTO `user_coupons` VALUES (1,27,6,'2025-10-27 00:43:24','2025-10-27 00:43:24','2025-10-27 00:43:24');
/*!40000 ALTER TABLE `user_coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otpExpire` datetime DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gender` tinyint(1) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `loyaltyPoints` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'ledaonhansam001@gmail.com','$2b$12$aKxzVFyGLVfC2WIPkzrpS.db65F5/J2NHxWgcdQa3r66kWfoCrkxi','Le','Nhan','0335585657',NULL,NULL,'user',1,'2025-09-16 06:43:56','2025-09-28 11:40:12',1,'2004-10-14',NULL,51),(21,'ledaonhansam@gmail.com','$2b$10$/nzVzeweCHupVlYv0ZR5i.VMuI/5QetT7Crw2EPZYi1AZJu5VKjS6','Nhân Sâm','Lê123','0335585612',NULL,NULL,'admin',1,'2025-10-25 22:45:26','2025-10-26 23:49:13',0,NULL,NULL,0),(22,'ledaonhansam002@gmail.com','$2b$10$JnGchnQtvkcbkf5X4o4jfeVbcvmfqnroEMoVeBtsq7B4WKcf7X5Qu','Nhân Sâm','Lê','0335585613',NULL,NULL,'admin',1,'2025-10-26 00:31:25','2025-10-26 23:01:54',NULL,NULL,NULL,0),(23,'nguyengiakhang116@gmail.com','$2b$10$YAplQ61N20dTQ8SkUb8YEuU8Dom9ikjm/VoQbuvw6cD6kVDoNIuSK','Nguyen Gia','Khang','0762751676',NULL,NULL,'admin',0,'2025-10-26 21:28:12','2025-10-26 23:01:55',NULL,NULL,NULL,0),(24,'giakhang116@gmail.com','$2b$12$fZjJa/56Y5YsfbNo2KohZuTz9PhlCZddP9Dpu/EHvkSLARTSw5orK','Nguyen Gia','Khang','0762751671',NULL,NULL,'user',0,'2025-10-26 21:29:17','2025-10-26 23:01:55',NULL,NULL,NULL,0),(27,'nguyenhoanggiaphong1310@gmail.com','$2b$12$mJOToGVOZMLv8xdu5iRb5.4h.PwbTDxlV7/rYc2WJLJhwi2HcT5aW','Baooo','Nguyenn','0768640217',NULL,NULL,'user',1,'2025-10-26 23:06:53','2025-10-27 00:43:25',1,'2004-10-14',NULL,15),(28,'nguyenhoanggiaphong1222@gmail.com','$2b$10$noHty/BlTTbrepdlDnEmiOS0sTYqQfK/HFGPd7Yg1GrV5B4SrIFGC','Baooo','Nguyenn','0707751852',NULL,NULL,'admin',1,'2025-10-26 23:46:48','2025-10-26 23:56:43',NULL,NULL,NULL,0),(30,'nguyenhoanggiaphong12@gmail.com','$2b$12$6qAi0nCWv3LJmN3YxwXkHO7x/GUzhtURWt3QSHMfnAbkjXZ464FrK','Baooo','Nguyennn','0768640218',NULL,NULL,'user',1,'2025-10-27 00:23:41','2025-10-27 00:25:04',NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `viewedproducts`
--

DROP TABLE IF EXISTS `viewedproducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viewedproducts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viewedproducts`
--

LOCK TABLES `viewedproducts` WRITE;
/*!40000 ALTER TABLE `viewedproducts` DISABLE KEYS */;
INSERT INTO `viewedproducts` VALUES (20,3,2,'2025-10-19 20:48:58','2025-10-19 20:48:58'),(21,3,11,'2025-10-19 20:49:11','2025-10-19 20:49:11'),(23,3,5,'2025-10-26 00:34:54','2025-10-26 00:34:54'),(24,3,1,'2025-10-26 01:59:05','2025-10-26 01:59:05'),(25,26,3,'2025-10-26 22:35:27','2025-10-26 22:35:27'),(27,27,5,'2025-10-26 23:08:02','2025-10-26 23:08:02'),(37,28,3,'2025-10-27 00:08:12','2025-10-27 00:08:12'),(39,28,5,'2025-10-27 00:08:19','2025-10-27 00:08:19'),(40,28,4,'2025-10-27 00:08:42','2025-10-27 00:08:42'),(45,27,11,'2025-10-27 00:19:42','2025-10-27 00:19:42'),(47,28,1,'2025-10-27 00:20:27','2025-10-27 00:20:27'),(54,28,6,'2025-10-27 00:32:03','2025-10-27 00:32:03'),(56,28,11,'2025-10-27 00:33:21','2025-10-27 00:33:21'),(59,27,6,'2025-10-27 00:35:57','2025-10-27 00:35:57'),(61,27,1,'2025-10-27 00:41:02','2025-10-27 00:41:02'),(63,27,2,'2025-10-27 00:45:42','2025-10-27 00:45:42');
/*!40000 ALTER TABLE `viewedproducts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discountType` enum('PERCENT','FIXED') NOT NULL,
  `discountValue` decimal(10,2) NOT NULL,
  `minOrderValue` decimal(12,2) DEFAULT NULL,
  `maxDiscountValue` decimal(12,2) DEFAULT NULL,
  `expiredAt` datetime NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES (1,'SALE10K','FIXED',10000.00,50000.00,NULL,'2025-12-31 00:00:00','2025-09-26 16:45:49','2025-09-26 16:45:49'),(2,'SALE20P','PERCENT',20.00,100000.00,100000.00,'2025-12-31 00:00:00','2025-09-26 16:45:49','2025-09-26 16:45:49'),(3,'FREESHIP','FIXED',15000.00,0.00,NULL,'2025-12-31 00:00:00','2025-09-26 16:45:49','2025-09-26 16:45:49');
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product_wishlist` (`userId`,`productId`),
  KEY `productId` (`productId`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (8,27,11,'2025-10-26 23:07:04','2025-10-26 23:07:04'),(9,27,1,'2025-10-26 23:07:04','2025-10-26 23:07:04'),(10,27,5,'2025-10-26 23:07:07','2025-10-26 23:07:07'),(13,27,6,'2025-10-26 23:07:18','2025-10-26 23:07:18'),(14,28,2,'2025-10-27 00:08:49','2025-10-27 00:08:49');
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-27  0:49:47
