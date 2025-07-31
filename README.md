# Overview

### This project is a full-featured conversational AI interface inspired by modern chat apps like Google gemini and ChatGPT. It features secure OTP-based authentication, a responsive UI optimized for both desktop and mobile, and persistent chatroom/message storage using Redux and localStorage. The app offers an intuitive UX for creating, renaming, and deleting chatrooms, chatting with an AI assistant, uploading images,

### [Live Link](https://kuvaka-assessment.vercel.app/)

### Setup and run instructions

#### Clone the repository
#### git clone https://github.com/hisekr/Kuvaka-assessment.git
#### cd Kuvaka-assessment
#### install dependencies -> Run " npm install" -> " npm run dev "
#### The app will be running locally at: http://localhost:3000


## Features

### 🔐 OTP Authentication
- Phone number-based login/signup with OTP flow
- Auto-focused OTP inputs for seamless typing
- Session persistence using `localStorage`

### 💬 Chatroom Management
- Create, delete, rename, and search chatrooms
- Select chatrooms to resume past conversations
- Supports optimistic UI updates and state persistence

### 🤖 Conversational Interface
- Chat with an AI assistant (mocked)
- Send messages with text or image support
- Loading indicators and typing feedback

### 📱 Mobile-Friendly UX
- Fully responsive layout
- Sidebar collapses automatically on mobile after chatroom selection
- Smooth transitions between chatroom and message views

### 🧠 Smart UI Enhancements
- Typing indicator while user types
- Copy-to-clipboard icon visible on message hover
- Image upload with previews and restricts on storage limits

---

## 🧱 Tech Stack

| Category      | Tools/Tech                              |
|---------------|------------------------------------------|
| Frontend      | **Next.js 15 App Router**, React, Tailwind CSS |
| State Mgmt    | **Redux Toolkit**, localStorage persistence |
| Forms & Validation | React Hook Form, Zod                  |
| API Fetching  | Tanstack Query  |
| Notifications | React Toastify                          |
| Other         | UUID/Nanoid, Debounce, |


### How throttling in implmented?
#### This is not strict throttling, but it's doing a delayed response simulation — which mimics throttling for AI responses.
#### I added a small delay before the AI ("Gemini") sends a response. This delay simulates typing and gives the impression that the AI is thinking before replying. It's done using a setTimeout with a delay of about 1.5 seconds plus a bit of randomness, Also, I made sure that the AI only replies once per message by using a flag called isResponding. This helps prevent multiple AI replies if the user sends messages quickly one after another. While this isn’t a traditional throttling function, it kind of acts like one by temporarily blocking further AI replies until the current one is done.

### How Form validation is implemented?
#### Form validation in this project is handled using React Hook Form along with Zod for schema-based validation. On the phone input form, I used a Zod schema to ensure that the user selects a country code and enters a valid phone number between 8 to 15 digits. This helps prevent invalid numbers from being submitted. The schema is connected to the form using the zodResolver, which is used to show specific error messages under each field if the input doesn't meet the required conditions. For the OTP verification screen, I used basic validations inside the form logic to ensure all four digits are entered before allowing the user to continue.

### How pagination and infinite scroll is implemented?
#### This uses client-side pagination with infinite scroll for loading chat messages. Instead of rendering all messages at once, which could affect performance for long conversations, only a fixed number (20 messages per page) are shown initially using a MESSAGES_PER_PAGE constant. These messages are sliced from the complete message list and updated dynamically as the user scrolls.The main scroll container (chatRef) listens for scroll events. When the user scrolls to the top of the chat, the app checks if more messages can be loaded. If yes, it increments the currentPage state after a short delay to simulate loading. This triggers a re-render with more messages loaded above.

### How debounce is implemented?
#### The search feature in the sidebar uses a debounce technique. Instead of immediately filtering chatrooms on every single key press (which can cause too many re-renders), the app waits until the user pauses typing for 500 milliseconds before applying the filter.This is done by keeping track of a timer using a useRef hook called debounceTimer. Whenever the search input changes, any existing timer is cleared and a new one is started. Only when this timer finishes without interruption (i.e., the user stops typing), the search query is updated in state (debouncedSearch). The chatrooms list is then filtered based on this debounced search term.

---
## 📸 Screenshots

### 🔐 Login Page
![Login Screen](/assets/kuvakaLogin.png)

### 🔑 OTP Verification
![OTP Screen](/assets/kuvakaOtpVerification.png)

### 🧠 Dashboard - Full View
![Dashboard 1](/assets/kuvakaDashboard1.png)

### 💬 Dashboard - Chat View
![Dashboard 2](/assets/kuvakaDashboard2.png)


## Folder struccture (src)

```plaintext
src/
├── app/
│   ├── dashboard/
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   ├── login/
│   │   └── page.js
│   ├── otp-verification/
│   │   └── page.js
│   ├── page.js  # unused
│   └── signup/
│       └── page.js
├── components/
│   ├── ChatInput.js
│   ├── ChatInterface.js
│   ├── ImagePreview.js
│   ├── MessageBubble.js
│   ├── Navbar.js
│   ├── OtpForm.js
│   ├── ProtectedRoute.js
│   └── SideBar.js
├── services/
│   └── api.js
└── store/
    ├── index.js
    ├── slices/
    │   ├── authSlice.js
    │   ├── chatSlice.js
    │   ├── messagesSlice.js
    │   └── uiSlice.js
    └── utils/
        └── user.js
```

