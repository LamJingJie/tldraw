# Project Submission Template Creator

## Introduction

This project enables users to create customizable submission templates for others, such as students, to submit their work within designated frames. It's designed to streamline the submission process in educational settings, making it easier for instructors to collect and organize student submissions.

## Thinks to note
- **Main Frame**: Do not change the main frame name, to allow the script to acurately identify which frame to extract 

## Features

With this tool, users can specify:

- **Description**: A brief overview of the submission requirements.
- **Due Date**: The deadline for submissions.
- **Submissions Per Student**: How many submissions each student is allowed to make.
- **Number of Students**: The total number of students expected to submit work.
- **Names of Each Student**: Individual names for each student's submission frame.

- **Image Snapping**: Users can throw in their img into their respective frame and it will snap dynamically
- **Color Changing**: Colour in the frames changes depending on submission status

### Conditional Frame Creation

- **More Student Names than Student Amt**: If the number of names inputted exceeds the specified number of students, the application will create a frame for each name provided, ignoring the "Number of Students" setting.
- **Equal Students Names and Student Amt**: If the number of names matches the number of students, a frame will be created for each student.
- **Less Student Names than Student Amt**: When fewer names are provided than the number of students, frames will be created for each name. Subsequent frames without specific names will be assigned default names.

## Getting Started

To use this project, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies.
4. Run the application.
5. Follow the on-screen instructions to create a submission template.

## License

Distributed under the MIT License. See `LICENSE` for more information.