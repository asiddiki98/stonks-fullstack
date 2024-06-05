# Project Name

## Overview

This project is a full-stack application built with Next.js for the frontend and Supabase for the backend. It allows users to browse a list of channels (profiles), follow channels, start streaming, receive push notifications or emails for new streams, and engage in basic chat functionality.

## Technologies Used

- Frontend: Next.js
- Backend: Supabase
- Websockets: AWS CloudFormation
- Email: Nodemailer


## Database Schema

### Profiles Table

| Column Name                | Data Type | Constraints |
| -------------------------- | --------- | ----------- |
| `id`                       | UUID      | Primary Key |
| `username`                 | VARCHAR   | Unique      |
| `email`                    | VARCHAR   | Unique      |
| `is_streaming`             | BOOLEAN   |             |
| `is_online`                | BOOLEAN   |             |
| `notification_preferences` | JSONB     |             |
| `created_at`               | TIMESTAMP |             |
| `updated_at`               | TIMESTAMP |             |

### Follows Table

| Column Name   | Data Type | Constraints |
| ------------- | --------- | ----------- |
| `id`          | UUID      | Primary Key |
| `follower_id` | UUID      | Foreign Key |
| `follows_id`  | UUID      | Foreign Key |
| `created_at`  | TIMESTAMP |             |

