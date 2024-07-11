import { BaseBoxShapeTool, FrameShapeTool, StateNode, TLPointerEvent, TLShapeId, createShapeId } from "tldraw";
import { getLocalStorageItem_input, InputData } from '../SubTemp/LocalStorage';



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

        let main_frame_width: number = screen.width;
        let main_frame_height: number = screen.height;
        const { currentPagePoint } = this.editor.inputs;


        // (1) **Create for submission frames**
        let frame_submissions_data = []
        let number_of_students: number = local_storage_data.students;
        let number_of_submissions: number = local_storage_data.submissions;

        // Padding for description and date
        let padding_for_desc: number = 200
        let padding_per_frame: number = 30;
        let padding_for_name: number = 40;

        // Dimensions of each submission frame
        let width_of_each_submission: number = 200;
        let height_of_each_submission: number = 200 * number_of_submissions + padding_for_name;

        // Top left to bottom positioning, leave space for description and date
        let curr_position_subframe_y: number = currentPagePoint.y - (main_frame_height / 2) + padding_for_desc;
        let total_height: number = height_of_each_submission + padding_for_desc + 100;
        let total_width: number = 0;

        // Create the submission frames
        for (let i = 0; i < number_of_students; i++) {

            // Left to right positioning
            let curr_position_subframe_x = (currentPagePoint.x + total_width) - (main_frame_width / 2) + padding_per_frame;
            total_width += width_of_each_submission + padding_per_frame;

            // If the total width exceeds the main frame width, move to the next row
            if (total_width >= main_frame_width) {
                total_height += height_of_each_submission + padding_per_frame + 20;
                curr_position_subframe_y += height_of_each_submission + padding_per_frame + 20; // Move to the next row
                total_width = 0; // Reset the width
                curr_position_subframe_x = (currentPagePoint.x + total_width) - (main_frame_width / 2) + padding_per_frame; // Reset the x position
                total_width += width_of_each_submission + padding_per_frame;
            }

            // Create the submission frame
            const data = {
                id: createShapeId(Math.random().toString()),
                type: 'submission_frame',
                x: curr_position_subframe_x,
                y: curr_position_subframe_y,
                props: {
                    w: width_of_each_submission,
                    h: height_of_each_submission,
                    name: 'test_name 0' + String(i),
                    submissions: number_of_submissions,
                },
            }
            frame_submissions_data.push(data);
        }



        // (2) **Create Description and Date shape**
        // Top right corner
        let padding: number = 20;
        let curr_position_content_x: number = currentPagePoint.x;
        let curr_position_content_y: number = currentPagePoint.y - (main_frame_height / 2) + padding;
        const content_data = {
            id: createShapeId(Math.random().toString()),
            type: 'text',
            x: curr_position_content_x,
            opacity: 1,
            y: curr_position_content_y,
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
            x: currentPagePoint.x - (main_frame_width / 2),
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