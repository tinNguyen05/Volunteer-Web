CREATE TABLE user_profiles (
                               user_id       UUID PRIMARY KEY,
                               full_name     VARCHAR(100) NOT NULL,
                               bio           TEXT,
                               phone_number  VARCHAR(20),
                               address       TEXT,
                               avatar_url    VARCHAR(255),
                               date_of_birth DATE,
                               created_at    TIMESTAMP(6) NOT NULL,
                               updated_at    TIMESTAMP(6),
                               email         VARCHAR(100),
                               username      VARCHAR(100) UNIQUE NOT NULL,
                               status        VARCHAR(255) NOT NULL CHECK (status IN (
                                                                         'PENDING','ACTIVE','INACTIVE','SUSPENDED','BANNED','DEACTIVATED','LOCKED','ARCHIVED'))
);

CREATE TABLE events (
                        event_id          BIGINT PRIMARY KEY,
                        created_at        TIMESTAMP(6) NOT NULL,
                        event_description TEXT,
                        event_location    TEXT,
                        event_name        VARCHAR(200) NOT NULL,
                        event_state       VARCHAR(255) NOT NULL,
                        updated_at        TIMESTAMP(6),
                        created_by        UUID REFERENCES user_profiles(user_id),
                        metadata          JSONB,
                        image_url         VARCHAR(500),
                        end_at            TIMESTAMP,
                        start_time        TIMESTAMP(6)
);

CREATE TABLE likes (
                       like_id     BIGINT PRIMARY KEY,
                       created_at  TIMESTAMP(6) NOT NULL,
                       target_type VARCHAR(255) CHECK (target_type IN ('COMMENT','POST','EVENT','LIKE')),
                       target_id   BIGINT,
                       created_by  UUID REFERENCES user_profiles(user_id)
);

CREATE TABLE posts (
                       post_id    BIGINT PRIMARY KEY,
                       content    TEXT NOT NULL,
                       created_at TIMESTAMP(6) NOT NULL,
                       updated_at TIMESTAMP(6),
                       created_by UUID REFERENCES user_profiles(user_id),
                       event_id   BIGINT REFERENCES events(event_id),
                       metadata   JSONB,
                       image_url  VARCHAR(255),
                       title      VARCHAR(255)
);

CREATE TABLE comments (
                          comment_id BIGINT PRIMARY KEY,
                          content    TEXT NOT NULL,
                          created_at TIMESTAMP(6) NOT NULL,
                          updated_at TIMESTAMP(6),
                          created_by UUID REFERENCES user_profiles(user_id),
                          post_id    BIGINT REFERENCES posts(post_id),
                          metadata   JSONB
);

CREATE TABLE role_in_event (
                               id                   BIGINT PRIMARY KEY,
                               created_at           TIMESTAMP(6) NOT NULL,
                               event_role           VARCHAR(255),
                               updated_at           TIMESTAMP(6),
                               event_id             BIGINT REFERENCES events(event_id),
                               user_profile_id      UUID REFERENCES user_profiles(user_id),
                               participation_status VARCHAR(255),
                               UNIQUE (user_profile_id, event_id)
);

CREATE TABLE event_registration (
                                    registration_id BIGINT PRIMARY KEY,
                                    event_id        BIGINT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
                                    user_id         UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
                                    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    UNIQUE (user_id, event_id)
);

CREATE INDEX idx_user_event_status ON event_registration (user_id, event_id);
CREATE INDEX idx_user_event        ON event_registration (user_id, event_id);

CREATE TABLE user_auth (
                           user_id        UUID PRIMARY KEY,
                           email          VARCHAR(100) NOT NULL UNIQUE,
                           email_verified BOOLEAN NOT NULL,
                           password_hash  TEXT NOT NULL,
                           role           VARCHAR(30) NOT NULL CHECK (role IN ('USER','EVENT_MANAGER','ADMIN')),
                           status         VARCHAR(30) NOT NULL CHECK (status IN ('ACTIVE','DISABLED','LOCKED'))
);

CREATE TABLE blood_donation (
                                id              BIGSERIAL PRIMARY KEY,
                                full_name       VARCHAR(255) NOT NULL,
                                email           VARCHAR(255) NOT NULL,
                                phone_number    VARCHAR(20) NOT NULL,
                                blood_type      VARCHAR(10) NOT NULL,
                                medical_history TEXT,
                                desired_date    DATE NOT NULL,
                                created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                status          VARCHAR(50) DEFAULT 'PENDING'
);

-- Foreign Key Constraints
ALTER TABLE user_profiles ADD CONSTRAINT fk_user_auth 
    FOREIGN KEY (user_id) REFERENCES user_auth(user_id) ON DELETE CASCADE;

ALTER TABLE events ADD CONSTRAINT fk_events_user_profiles 
    FOREIGN KEY (created_by) REFERENCES user_profiles(user_id);

ALTER TABLE posts ADD CONSTRAINT fk_posts_user_profiles 
    FOREIGN KEY (created_by) REFERENCES user_profiles(user_id);

ALTER TABLE comments ADD CONSTRAINT fk_comments_user_profiles 
    FOREIGN KEY (created_by) REFERENCES user_profiles(user_id);

ALTER TABLE likes ADD CONSTRAINT fk_likes_user_profiles 
    FOREIGN KEY (created_by) REFERENCES user_profiles(user_id);

ALTER TABLE role_in_event ADD CONSTRAINT fk_role_user_profiles 
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(user_id);
