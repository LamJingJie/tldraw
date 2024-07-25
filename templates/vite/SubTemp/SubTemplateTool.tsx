import { BaseBoxShapeTool, FrameShapeTool, StateNode, TLPointerEvent, TLShapeId, createShapeId } from "tldraw";
import { 
    getLocalStorageItem_input, 
    getLocalStorageItem_student_list, 
    InputData, 
    setLocalStorageItem_student_list
 } from '../SubTemp/LocalStorage';



// This is where you design the tool
export class SubTemplateTool extends StateNode {

    static override id = 'custom_template_id' //For Ui-overrides
    static override initial = 'idle'
    //override shapeType = 'submission_frame'

    // When the tool is selected/entered by the user
    override onEnter = () => {
        this.editor.setCursor({ type: 'cross', rotation: 0 });
    }



    // *Bug: If include parentID prop, the shapes are not created until the main shape is moved once. It will then appear at random areas.
    override onPointerDown = () => {
        const local_storage_data: InputData = getLocalStorageItem_input();
        const student_list: string[] = getLocalStorageItem_student_list();
        let amt_of_students_in_list: number = 0;
        for(let i = 0; i < student_list.length; i++){
            student_list[i] != "" && (amt_of_students_in_list++);
        }
        // Ignore the last element if its empty string 
        student_list[student_list.length - 1] === '' && (student_list.pop());

        // Default main frame dimensions
        let main_frame_width: number = 1200;
        let main_frame_height: number = 900;
        const { currentPagePoint } = this.editor.inputs;


        // (1) **Create for submission frames**
        let frame_submissions_data = []
        let number_of_students: number = local_storage_data.students;
        let number_of_submissions: number = local_storage_data.submissions;

        // Padding for description and date
        let padding_for_desc: number = 200
        let padding_per_frame: number = 30;
        let padding_for_username: number = 40;

        // Dimensions of each submission frame
        let width_of_each_submission: number = 200;
        let height_of_each_submission: number = 200 * number_of_submissions + padding_for_username;

        // Top left to bottom positioning, leave space for description and date
        let curr_position_subframe_y: number = currentPagePoint.y - (main_frame_height / 2) + padding_for_desc;
        let total_height: number = height_of_each_submission + padding_for_desc + 100;

        // Total width of each row and highest width amongst all rows
        let total_width: number = padding_per_frame;
        let highest_width: number = padding_per_frame;

        //move the main frame and desc by how much to the right based on the highest width
        let offset_x: number = 0; 

        // For when student list >== number of students
        for (let i = 0; i < student_list.length; i++) {
            let curr_position_subframe_x = (currentPagePoint.x + total_width) - (main_frame_width / 2);

            if (student_list[i] === '') {
                console.log("Next section");
                total_height += height_of_each_submission + padding_per_frame + 20;
                curr_position_subframe_y += height_of_each_submission + padding_per_frame + 20; // Move to the next row
                total_width > highest_width && (highest_width = total_width);
                total_width = padding_per_frame; // Reset the width
                curr_position_subframe_x = (currentPagePoint.x + total_width) - (main_frame_width / 2); // Reset the x position
                continue;
            }

            const data = {
                id: createShapeId(Math.random().toString()),
                type: 'submission_frame',
                x: curr_position_subframe_x,
                y: curr_position_subframe_y,
                props: {
                    w: width_of_each_submission,
                    h: height_of_each_submission,
                    name: student_list[i],
                    submissions: number_of_submissions,
                },
            }
            frame_submissions_data.push(data);
            total_width += width_of_each_submission + padding_per_frame;
        }
        total_width > highest_width && (highest_width = total_width);

        

        // Reset the width and move to the next row

        // Add styling if student list is not empty and there are still students left to be added
        if(student_list.length !== 0 && number_of_students - amt_of_students_in_list > 0){
            total_height += height_of_each_submission + padding_per_frame + 20;
            curr_position_subframe_y += height_of_each_submission + padding_per_frame + 20; // Move to the next row
            total_width = padding_per_frame;
        }

        // For when student list < number of students
        // Populate the remaining frames with default names
        for (let i = 0; i < number_of_students - amt_of_students_in_list; i++) {
            let curr_position_subframe_x = (currentPagePoint.x + total_width) - (main_frame_width / 2);
            const data = {
                id: createShapeId(Math.random().toString()),
                type: 'submission_frame',
                x: curr_position_subframe_x,
                y: curr_position_subframe_y,
                props: {
                    w: width_of_each_submission,
                    h: height_of_each_submission,
                    name: 'Student ' + String(i + 1),
                    submissions: number_of_submissions,
                },
            }
            frame_submissions_data.push(data);
            total_width += width_of_each_submission + padding_per_frame;
        }
        total_width > highest_width && (highest_width = total_width);

        // Last check for highest width and get offset to move the main frame and desc
        if (highest_width > main_frame_width) {
            offset_x = (highest_width - main_frame_width) / 2;
            main_frame_width = highest_width;
        }
        

        // (2) **Create Description and Date shape**
        // Top right corner
        let padding: number = 20;
        let curr_position_content_x: number = currentPagePoint.x;
        let curr_position_content_y: number = currentPagePoint.y - (main_frame_height / 2) + padding;
        const content_data = {
            id: createShapeId(Math.random().toString()),
            type: 'text',
            x: curr_position_content_x + offset_x,
            opacity: 1,
            y: curr_position_content_y,
            isLocked: true,
            props: {
                // text: 'First iteration of site in blender/rhino  ::  DUE 26 MAY (SUNDAY) 2359',
                text: local_storage_data.description + '  ::  DUE ' + local_storage_data.dueDate,
                color: 'black',
                size: "m",
                font: "sans",
                scale: 1,
                autoSize: true,
            },
        }


        // (3) **Create for main frame and calculate how tall it should be**
        // - Use normal frame because a custom frame/shape wouldnt be able to have the other shapes be its 'child' when initialized.
        const frame_template_id = createShapeId(Math.random().toString());
        const pageName = this.editor.getCurrentPage().name;
        const main_frame = {
            id: frame_template_id,
            type: 'frame',
            x: currentPagePoint.x - (main_frame_width / 2) + offset_x,
            y: currentPagePoint.y - (main_frame_height / 2),
            props: {
                w: main_frame_width,
                h: total_height,
                name: pageName,
            },
        }


        this.editor.createShapes([main_frame]);
        this.editor.createShapes([content_data]);
        this.editor.createShapes(frame_submissions_data);

        this.editor.setCurrentTool('select');
    }

}