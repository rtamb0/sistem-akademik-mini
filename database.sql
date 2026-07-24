CREATE DATABASE IF NOT EXISTS `db_kuliah`;
USE `db_kuliah`;

-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: db_kuliah
-- ------------------------------------------------------
-- Server version	8.4.8

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
-- Table structure for table `mahasiswa`
--

DROP TABLE IF EXISTS `mahasiswa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mahasiswa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nim` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `prodi_id` int NOT NULL,
  `angkatan` int NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nim` (`nim`),
  KEY `fk_mahasiswa_prodi` (`prodi_id`),
  CONSTRAINT `fk_mahasiswa_prodi` FOREIGN KEY (`prodi_id`) REFERENCES `prodi` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prodi`
--

DROP TABLE IF EXISTS `prodi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prodi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode_prodi` varchar(20) NOT NULL,
  `nama_prodi` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama_prodi` (`nama_prodi`),
  UNIQUE KEY `uq_prodi_kode` (`kode_prodi`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` char(64) DEFAULT NULL,
  `reset_token_expired_at` datetime DEFAULT NULL,
  `role` enum('admin','operator','viewer') NOT NULL DEFAULT 'viewer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


/*!40101 SET character_set_client = @saved_cs_client */;

-- ------------------------------------------------------
-- Dummy data for table `prodi`
-- ------------------------------------------------------

INSERT INTO `prodi` (`id`, `kode_prodi`, `nama_prodi`, `created_at`) VALUES
(1, 'IF', 'Informatika', '2026-07-01 08:00:00'),
(2, 'SI', 'Sistem Informasi', '2026-07-01 08:05:00'),
(3, 'TI', 'Teknologi Informasi', '2026-07-01 08:10:00'),
(4, 'DKV', 'Desain Komunikasi Visual', '2026-07-01 08:15:00'),
(5, 'AK', 'Akuntansi', '2026-07-01 08:20:00'),
(6, 'MN', 'Manajemen', '2026-07-01 08:25:00');

ALTER TABLE `prodi` AUTO_INCREMENT = 7;


-- ------------------------------------------------------
-- Dummy data for table `mahasiswa`
-- ------------------------------------------------------

INSERT INTO `mahasiswa`
(`id`, `nim`, `nama`, `prodi_id`, `angkatan`, `foto`, `created_at`, `updated_at`)
VALUES
(1, '0112523001', 'Andi Pratama', 1, 2023, NULL, '2026-07-02 09:00:00', '2026-07-02 09:00:00'),
(2, '0112523002', 'Budi Santoso', 1, 2023, NULL, '2026-07-02 09:05:00', '2026-07-02 09:05:00'),
(3, '0112523003', 'Citra Lestari', 1, 2023, NULL, '2026-07-02 09:10:00', '2026-07-02 09:10:00'),
(4, '0122523001', 'Dewi Anggraini', 2, 2023, NULL, '2026-07-02 09:15:00', '2026-07-02 09:15:00'),
(5, '0122524002', 'Eko Saputra', 2, 2024, NULL, '2026-07-02 09:20:00', '2026-07-02 09:20:00'),
(6, '0132522001', 'Farhan Ramadhan', 3, 2022, NULL, '2026-07-02 09:25:00', '2026-07-02 09:25:00'),
(7, '0132523002', 'Gita Permata', 3, 2023, NULL, '2026-07-02 09:30:00', '2026-07-02 09:30:00'),
(8, '0142523001', 'Hendra Wijaya', 4, 2023, NULL, '2026-07-02 09:35:00', '2026-07-02 09:35:00'),
(9, '0142524002', 'Intan Maharani', 4, 2024, NULL, '2026-07-02 09:40:00', '2026-07-02 09:40:00'),
(10, '0152522001', 'Joko Firmansyah', 5, 2022, NULL, '2026-07-02 09:45:00', '2026-07-02 09:45:00'),
(11, '0152523002', 'Kartika Sari', 5, 2023, NULL, '2026-07-02 09:50:00', '2026-07-02 09:50:00'),
(12, '0162523001', 'Lukman Hakim', 6, 2023, NULL, '2026-07-02 09:55:00', '2026-07-02 09:55:00'),
(13, '0162524002', 'Maya Putri', 6, 2024, NULL, '2026-07-02 10:00:00', '2026-07-02 10:00:00'),
(14, '0112524004', 'Naufal Rizki', 1, 2024, NULL, '2026-07-02 10:05:00', '2026-07-02 10:05:00'),
(15, '0122522005', 'Olivia Amanda', 2, 2022, NULL, '2026-07-02 10:10:00', '2026-07-02 10:10:00');

ALTER TABLE `mahasiswa` AUTO_INCREMENT = 16;


-- ------------------------------------------------------
-- Dummy data for table `users`
-- ------------------------------------------------------

INSERT INTO `users`
(`id`, `name`, `email`, `password`, `reset_token`,
 `reset_token_expired_at`, `role`, `created_at`, `updated_at`)
VALUES
(
  1,
  'Administrator',
  'admin@kampus.com',
  '$2b$10$pab029KagW/YOKV5NOlPK.U4eQWuGtnwrIHgsX7inwjvn1/a3dERC',
  NULL,
  NULL,
  'admin',
  '2026-07-01 08:00:00',
  '2026-07-01 08:00:00'
),
(
  2,
  'Operator Kampus',
  'operator@kampus.com',
  '$2b$10$AK.oVT81D7sr606489nPk.11b/laBf/ZPpPdMpeIEdLecEI7choPC',
  NULL,
  NULL,
  'operator',
  '2026-07-01 08:05:00',
  '2026-07-01 08:05:00'
),
(
  3,
  'Viewer Kampus',
  'viewer@kampus.com',
  '$2b$10$PNOHcNBZV0OeODBKrKrIhuO6yWr7R/TJs/b4BfV1V8o1lBu7adCU.',
  NULL,
  NULL,
  'viewer',
  '2026-07-01 08:10:00',
  '2026-07-01 08:10:00'
);

ALTER TABLE `users` AUTO_INCREMENT = 4;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-25  1:59:13
