-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 03, 2025 at 12:39 AM
-- Server version: 10.6.23-MariaDB-cll-lve
-- PHP Version: 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bikanelitewm`
--

-- --------------------------------------------------------

--
-- Table structure for table `BKLWM_AUTH_USER`
--

CREATE TABLE `BKLWM_AUTH_USER` (
  `ID` bigint(20) NOT NULL,
  `FIRST_NAME` varchar(100) NOT NULL,
  `LAST_NAME` varchar(100) DEFAULT NULL,
  `EMAIL_ID` varchar(150) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `CREATED_DATE` datetime DEFAULT current_timestamp(),
  `LAST_LOGIN` datetime DEFAULT NULL,
  `IS_USER_ACTIVE` tinyint(1) DEFAULT 1,
  `USERNAME` varchar(100) NOT NULL,
  `MOBILE_NUMBER` varchar(20) DEFAULT NULL,
  `VERIFICATION_TOKEN` varchar(255) DEFAULT NULL,
  `COUNTRY` varchar(100) DEFAULT NULL,
  `PHONE_CODE` varchar(10) DEFAULT NULL,
  `PASSWORD_CHANGE_COUNT` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `BKLWM_AUTH_USER`
--

INSERT INTO `BKLWM_AUTH_USER` (`ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL_ID`, `PASSWORD`, `CREATED_DATE`, `LAST_LOGIN`, `IS_USER_ACTIVE`, `USERNAME`, `MOBILE_NUMBER`, `VERIFICATION_TOKEN`, `COUNTRY`, `PHONE_CODE`, `PASSWORD_CHANGE_COUNT`) VALUES
(1, 'charitha', 'valla', 'charithasrivalla@gmail.com', '$2b$12$q8EQ9J7YcHoq41O9BxaCbe7g1Dg5MO7YzWbYnCtmCmw9Qlzamtl0m', '2025-12-02 01:36:27', '2025-12-02 01:36:42', 0, 'charithasrivalla', '8332031199', 'b5d39711-e54c-49a5-93d3-f7a98049c811', 'India', '+91', 0),
(2, 'Charitha', 'Valla', 'charithasrivalla13@gmail.com', '$2b$12$Iwnc43sDsDgjnWh7VmceuuU/B2yuJWA9C/cnwH8kCMVFkjbdi2iqe', '2025-12-02 14:20:09', '2025-12-02 17:28:01', 0, 'charithasrivalla13', '8332031199', '807d2bbd-9e01-42e3-be7f-798b63e4ebe7', 'India', '+91', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `BKLWM_AUTH_USER`
--
ALTER TABLE `BKLWM_AUTH_USER`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `EMAIL_ID` (`EMAIL_ID`),
  ADD UNIQUE KEY `USERNAME` (`USERNAME`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `BKLWM_AUTH_USER`
--
ALTER TABLE `BKLWM_AUTH_USER`
  MODIFY `ID` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
