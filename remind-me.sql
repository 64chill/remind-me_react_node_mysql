-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2019 at 12:21 AM
-- Server version: 10.1.33-MariaDB
-- PHP Version: 7.2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `remind-me`
--

-- --------------------------------------------------------

--
-- Table structure for table `approved_emails_to_edit_reminders`
--

CREATE TABLE `approved_emails_to_edit_reminders` (
  `approved_emails_to_edit_reminders_id` int(255) NOT NULL,
  `email` varchar(80) DEFAULT NULL,
  `reminders_token` varchar(255) DEFAULT NULL,
  `reminders_token_valid_till` timestamp NULL DEFAULT NULL,
  `id_reminder` int(255) DEFAULT NULL,
  `email_deleted` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `approved_emails_to_edit_reminders`
--

INSERT INTO `approved_emails_to_edit_reminders` (`approved_emails_to_edit_reminders_id`, `email`, `reminders_token`, `reminders_token_valid_till`, `id_reminder`, `email_deleted`) VALUES
(1, 'asdsad@asd.com', NULL, NULL, 14, 1),
(2, 'asdasdas@asdas.com', NULL, NULL, 14, 1),
(3, 'asdasdsa@asdsa.com', NULL, NULL, 15, 1),
(4, 'asdasd@asdas.asd', NULL, NULL, 14, 1),
(5, 'asdsadsa@asdas.asd', NULL, NULL, 14, 1),
(6, 'asdasd@asdas.com', NULL, NULL, 14, 1),
(7, 'asdasdas@asda.casd', NULL, NULL, 14, 0),
(8, 'asdasda@asdas.com', NULL, NULL, 14, 1),
(9, 'asdasdsadas@asdas.as', NULL, NULL, 14, 1),
(10, 'asdas@asd.cas', NULL, NULL, 14, 1),
(11, 'edit.allowed@example', '1r4Hrc59M8zLYY4hRYOfzzMX1yTz8x', '2019-08-28 16:35:42', 14, 0),
(13, 'somethingnew123@mailinator.com', 'xitweXdNVXFYxROC8Sh43ClxzxnatB', '2019-09-03 21:18:22', 14, 0);

-- --------------------------------------------------------

--
-- Table structure for table `init_settings`
--

CREATE TABLE `init_settings` (
  `init_settings_id` int(255) NOT NULL,
  `unapproved_non_registered_users` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `init_settings`
--

INSERT INTO `init_settings` (`init_settings_id`, `unapproved_non_registered_users`) VALUES
(1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `id_reminder` int(255) NOT NULL,
  `id_user` int(255) DEFAULT NULL,
  `remind_by` enum('text','email','calendar','slack') DEFAULT NULL,
  `title_reminder` varchar(50) DEFAULT NULL,
  `every` enum('week','forthnight','month','onceoff','custom') DEFAULT NULL,
  `approved` tinyint(1) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `next_date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `day_difference_between_reminders` date DEFAULT NULL,
  `confirmed_status` tinyint(1) DEFAULT NULL,
  `confirm_token` varchar(255) DEFAULT NULL,
  `confirm_token_date_time_valid_till` timestamp NULL DEFAULT NULL,
  `edit_token` varchar(255) DEFAULT NULL,
  `edit_token_date_time_valid_till` timestamp NULL DEFAULT NULL,
  `deleted_stopped` tinyint(1) DEFAULT NULL,
  `reminder_text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `reminders`
--

INSERT INTO `reminders` (`id_reminder`, `id_user`, `remind_by`, `title_reminder`, `every`, `approved`, `start_date`, `next_date`, `time`, `day_difference_between_reminders`, `confirmed_status`, `confirm_token`, `confirm_token_date_time_valid_till`, `edit_token`, `edit_token_date_time_valid_till`, `deleted_stopped`, `reminder_text`) VALUES
(11, 1, 'email', 'hello1', 'week', 1, '2019-07-18', '2019-08-08', '00:00:00', NULL, NULL, NULL, '0000-00-00 00:00:00', 'KJhjgO8Ahkj123GHja', '2019-08-09 23:00:00', 0, 'askjd lsa jkdahfkjdashkfjha sdkfjhdsajhdsa jkfhsd nf,msda nfasdf'),
(12, 1, 'email', 'title', 'week', 0, '2019-07-22', '2019-07-29', '00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'askld jkasl jdlkasj flkdsaj fkldsa fds fds fdas f'),
(13, 2, 'text', 'aaaaaa234', 'week', 1, '2019-07-22', '2019-07-18', '00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 1, 'asdas da sd jasj dnjsakadf dsa fdsa fds f'),
(14, 2, 'text', 'TITLE12', 'month', 1, '2019-10-17', '2019-11-15', '00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'aijsd lkjas lkdjlkasj lkdsj fkldas fasd fdas f'),
(15, 2, 'text', 'asdasdasd', 'month', 1, '2019-01-01', '2019-01-31', '00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'asdasdasdsadsadasd asd as df dsaf dsa fdsf'),
(16, 2, 'email', 'Titleeeee', 'week', 0, '2019-07-22', '2019-07-29', '06:50:00', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'asd salk jflksda jlkdasj flkjads;lkfads fdas fdas fdsa f'),
(17, 2, 'email', 'text1', 'week', 0, '2019-07-22', '2019-07-29', '15:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'as djsak hdsajkh kjdsah kjdhskj fhkjdasf sda fasd f'),
(18, 2, 'email', 'text2', 'week', 1, '2019-07-22', '2019-07-30', '15:34:00', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'asdas das df dsa fdsa fdas fdsaf dsaf dsa fdsaf das fsa dfads fds fdsa fd'),
(21, 16, 'text', 'Title Reminder', 'week', 0, '2019-08-05', '2019-08-12', '00:00:00', NULL, NULL, NULL, NULL, 'M5bQZQed35cyZYX7TK98Qo7N0lxTt3', '2019-08-05 16:10:22', 0, 'something something something something something '),
(22, 16, 'text', 'Title Reminder', 'week', 0, '2019-08-05', '2019-08-12', '00:00:00', NULL, NULL, NULL, NULL, 'fj7sSRl1V6U4ZY8W7bUHz5Bgbh2FJv', '2019-08-05 16:10:48', 0, 'something something something something something '),
(23, 16, 'text', 'Title Reminder', 'week', 0, '2019-08-05', '2019-08-12', '00:00:00', NULL, NULL, NULL, NULL, '2zarzvmrFLVOB2bff4MGGvinf2B7EO', '2019-08-05 16:12:51', 0, 'something something something something something '),
(24, 16, 'text', 'Title Reminder', 'week', 0, '2019-08-05', '2019-08-12', '00:00:00', NULL, NULL, NULL, NULL, 'VrbB96Qwk30MDozBGrCRPRRETI0kvD', '2019-08-05 16:13:57', 0, 'something something something something something '),
(25, 16, 'text', 'Title Reminder', 'week', 0, '2019-08-05', '2019-08-12', '00:00:00', NULL, NULL, NULL, NULL, 'JmmkPBWQXmi6rJEqVxuVx40JAjRxjw', '2019-08-05 16:14:21', 0, 'something something something something something '),
(26, 16, 'text', 'Title Reminder', 'week', 0, '2019-08-05', '2019-08-12', '00:00:00', NULL, NULL, NULL, NULL, 'pDtg2ttl9TkZXc5ncG6kxyhOjNDkOd', '2019-08-05 16:31:59', 0, 'something something something something something '),
(27, 17, 'text', 'Title Reminder', 'week', 0, '2019-08-05', '2019-08-12', '00:00:00', NULL, NULL, NULL, NULL, '35cGPxlkfsQ9puZ3voKrSLkZYnuCdJ', '2019-08-05 16:32:10', 0, 'something something something something something '),
(31, 18, 'email', 'dsadasdsadas123', 'week', 0, '2019-08-05', '2019-08-12', '00:00:00', NULL, NULL, NULL, NULL, 'f3eH8JsDSAgk3tNwLapBY13Z3J9Jie', '2019-08-06 16:43:52', 0, 'asdasdsad sa das asdsadsadasd as ds'),
(33, 18, 'email', 'asdasdsadas123', 'week', 1, '2019-08-05', '2019-08-12', '22:10:00', NULL, NULL, NULL, NULL, 'bxWOtBlsd2vD6iiUppaWsQeYyKpzz6', '2019-08-06 16:47:18', 0, 'asdasdasdsafddsfdasfda sf asd fdsa fads f');

-- --------------------------------------------------------

--
-- Table structure for table `saved_reminders_non_registered_users`
--

CREATE TABLE `saved_reminders_non_registered_users` (
  `id_reminder` int(255) NOT NULL,
  `id_user` int(255) DEFAULT NULL,
  `remind_by` enum('text','email','calendar','slack') DEFAULT NULL,
  `title_reminder` varchar(50) DEFAULT NULL,
  `every` enum('week','forthnight','month','onceoff','custom') DEFAULT NULL,
  `approved` tinyint(1) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `next_date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `day_difference_between_reminders` date DEFAULT NULL,
  `confirmed_status` tinyint(1) DEFAULT NULL,
  `confirm_token` varchar(255) DEFAULT NULL,
  `confirm_token_date_time_valid_till` timestamp NULL DEFAULT NULL,
  `deleted_stopped` tinyint(1) DEFAULT NULL,
  `reminder_text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(255) NOT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `pwd_hash` varchar(255) DEFAULT NULL,
  `user_phone` int(15) DEFAULT NULL,
  `user_slack` varchar(100) DEFAULT NULL,
  `email_get_param_login` varchar(100) DEFAULT NULL,
  `receive_email_regulary` tinyint(1) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_registered` tinyint(1) DEFAULT NULL,
  `confirmation_token` varchar(255) DEFAULT NULL,
  `confirmation_date_time_valid_till` timestamp NULL DEFAULT NULL,
  `confirmed_status` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `edit_token` varchar(255) NOT NULL,
  `edit_token_date_time_valid_till` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `user_email`, `pwd_hash`, `user_phone`, `user_slack`, `email_get_param_login`, `receive_email_regulary`, `email_verified`, `created_date`, `user_registered`, `confirmation_token`, `confirmation_date_time_valid_till`, `confirmed_status`, `deleted`, `edit_token`, `edit_token_date_time_valid_till`) VALUES
(1, 'example@example.com', '$2y$12$i7iaXciQHuV8JhR53dBi7e8BzWmzYxq7BRQ5hj8sY1gOPsZsGx1GO', NULL, NULL, NULL, 1, NULL, '2019-08-01 14:13:20', NULL, NULL, NULL, 0, 0, '', '0000-00-00 00:00:00'),
(2, 'example2@example.com', '$2b$10$V.5GLBgZqm/5vbj3gCuH3uxTW9s4.lltTHYiASMKMUE/YkOUw.7Ey', NULL, NULL, NULL, 1, NULL, '2019-08-01 14:13:29', NULL, NULL, NULL, 1, 0, '', '0000-00-00 00:00:00'),
(4, 'example22@example.com', '$2b$10$Cwzg8bGNfiTAc9pxTvNp3OwHnPGUUNJLrWcofRRgOc06/2TccVC/a', NULL, NULL, NULL, NULL, NULL, '2019-07-20 18:48:39', NULL, '1pAL3mG0iTemV@u3QsmueY4k6xc7(Y', '2019-07-22 19:30:48', 1, 0, '', '0000-00-00 00:00:00'),
(12, 'example33@example.com', '$2b$10$s4XeTaA0kIsZFGAKHgai3eNfNVPaoBxi2a/.QE226IgjkG9msIdMq', NULL, NULL, NULL, NULL, NULL, '2019-07-21 10:32:19', 1, 'q(TU89nnr(PjCUtQCOW&@WFeDmfp@@', '2019-07-23 12:32:19', 0, 0, '', '0000-00-00 00:00:00'),
(13, 'example343@example.com', '$2b$10$gZ6Ll8re/NBueDQlUxHrT.mwbWRSsT1YfG1tgN1FOOcOxLD9ckj.C', NULL, NULL, NULL, NULL, NULL, '2019-08-03 17:12:10', 0, 'sT*txrtupv%j3qD6mzYEpH!@R$mjTR', '2019-07-23 12:39:22', 0, 0, '', '0000-00-00 00:00:00'),
(16, 'thisnew@example.com', NULL, NULL, NULL, NULL, NULL, 0, '2019-08-03 16:05:47', 0, 'OuuCNPA71Nxo0fetcJt1aGFATqHR92', '2019-08-05 16:05:47', 0, 0, '', '0000-00-00 00:00:00'),
(17, 'thisnew2@example.com', NULL, NULL, NULL, NULL, 0, 0, '2019-08-03 18:10:31', 0, 'y8UFStRvWRKPouVP5XiNri0gguXyhy', '2019-08-05 16:32:09', 0, 0, '', '0000-00-00 00:00:00'),
(18, 'somethingnew123@mailinator.com', NULL, NULL, NULL, NULL, 1, 1, '2019-08-04 22:09:47', 0, 'vgh9YIZEm962RnDAUekIm9PPrZihMa', '2019-08-06 16:22:19', 0, 0, '', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approved_emails_to_edit_reminders`
--
ALTER TABLE `approved_emails_to_edit_reminders`
  ADD PRIMARY KEY (`approved_emails_to_edit_reminders_id`),
  ADD KEY `FK002` (`id_reminder`);

--
-- Indexes for table `init_settings`
--
ALTER TABLE `init_settings`
  ADD PRIMARY KEY (`init_settings_id`);

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id_reminder`),
  ADD KEY `FK001` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `approved_emails_to_edit_reminders`
--
ALTER TABLE `approved_emails_to_edit_reminders`
  MODIFY `approved_emails_to_edit_reminders_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id_reminder` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `approved_emails_to_edit_reminders`
--
ALTER TABLE `approved_emails_to_edit_reminders`
  ADD CONSTRAINT `FK002` FOREIGN KEY (`id_reminder`) REFERENCES `reminders` (`id_reminder`);

--
-- Constraints for table `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `FK001` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
