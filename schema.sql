-- Polling System Database Schema (PostgreSQL)
-- Run this in your PostgreSQL database

-- Create database if you haven't already:
-- CREATE DATABASE polling_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Polls table
CREATE TABLE IF NOT EXISTS polls (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_by BIGINT,
    status VARCHAR(50) NOT NULL,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_poll_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Options table
CREATE TABLE IF NOT EXISTS options (
    id BIGSERIAL PRIMARY KEY,
    poll_id BIGINT,
    option_text VARCHAR(255) NOT NULL,
    vote_count INT DEFAULT 0,
    CONSTRAINT fk_option_poll FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    poll_id BIGINT,
    option_id BIGINT,
    CONSTRAINT fk_vote_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vote_poll FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    CONSTRAINT fk_vote_option FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_poll UNIQUE (user_id, poll_id)
);
