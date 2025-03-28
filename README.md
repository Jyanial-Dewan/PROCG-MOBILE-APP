# PROCG

## App Description

PROCG is a Salesforce-like mobile application designed to streamline and optimize business processes. Built using React Native, it offers a robust, scalable, and responsive interface for users to manage their workflows efficiently. This app leverages modern libraries and tools like MobX for state management, Formik for form handling, and Axios for API integration, ensuring a high-quality, maintainable codebase.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Installation](#installation)
3. [Running the App](#running-the-app)
4. [Folder Structure](#folder-structure)
5. [Technologies Used](#technologies-used)
6. [License](#license)

---

## Project Setup

To set up the environment for the PROCG project, ensure your system meets the following prerequisites:

### Prerequisites

- **Operating System**: Fedora Linux 40 (Workstation Edition)
- **Node.js**: Version 20.17.0
- **Yarn**: Package manager
- **JDK**: Version 17.0.25
- **React Native CLI**: Installed globally using Yarn
- **Editor**: Visual Studio Code
- **Git**: For version control

### Environment Setup

1. Install **Node.js**:
   ```bash
   sudo dnf install nodejs
   ```
2. Install **Yarn**:
   ```bash
   sudo npm install -g yarn
   ```
3. Install **JDK**:
   ```bash
   sudo dnf install java-17-openjdk
   ```
4. Install **React Native CLI**:
   ```bash
   yarn global add react-native-cli
   ```
5. Verify installations:
   ```bash
   node -v
   yarn -v
   java -version
   ```

---

## Installation

To install the project and its dependencies, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/PROCG.git
cd PROCG
```

### 2. Install Dependencies

```bash
yarn install
```

---

## Running the App

Follow these steps to start the development server and run the app:

### 1. Start the Metro Bundler

```bash
yarn start
```

### 2. Run on Android

Ensure your Android emulator or device is ready, then execute:

```bash
yarn android
```

### 3. Run on iOS

For macOS users with Xcode installed:

```bash
yarn ios
```

### 4. Debugging

Use React Native Debugger or the developer tools available in your emulator/device.

---

## Folder Structure

A typical structure for this project is as follows:

```
PROCG/
├── android/        # Native Android project files
├── ios/            # Native iOS project files
├── src/            # Application source code
│   ├── components/ # Reusable components
│   ├── screens/    # App screens
│   ├── stores/     # MobX state management
│   ├── utils/      # Utility functions
│   ├── services/   # API services
│   └── assets/     # Images, fonts, etc.
├── README.md       # Project documentation
├── package.json    # Project configuration and dependencies
└── tsconfig.json   # TypeScript configuration
```

---

## Technologies Used

- **React Native**: Version 0.73.6
- **React**: Version 18.2.0
- **TypeScript**: Version 5.0.4
- **MobX**: Version 6.3.1 for state management
- **Formik**: Version 2.2.9 for form handling
- **Axios**: For API integration
- **Yarn**: For dependency management
- **JDK**: For Android development

---

## License

This project is licensed under the [MIT License](LICENSE).

For any issues or feature requests, please raise an issue on the [GitHub repository](https://github.com/your-username/PROCG).
