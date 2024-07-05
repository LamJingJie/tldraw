import { useEffect } from "react";
import { BaseBoxShapeUtil, HTMLContainer, ShapeProps, T, TLBaseShape, TLFrameShape, FrameShapeUtil, DefaultColorStyle,
    ShapeUtil, Rectangle2d, Editor, TLShape, createShapeId,
    resizeBox,
    TLOnResizeHandler,
    StateNode,
    TldrawHandles, 
    TldrawEditor,
    TLShapeId
 } from "tldraw";
 
 import { SubmissionFrameUtil } from './SubmissionFrameUtil';
import React from "react";

/**
 * This is where you design the template
 * 
 * # Of students
 * # of Submissions
 * Description
 * Due Date
 */


type mySubTemplateProps = {
    h: number;
    w: number;
    name: string;
    students: number;
    submissions: number;
    description: string;
    dueDate: string;
};

type mySubTemplateClass = TLBaseShape<'custom_template', mySubTemplateProps>;

let frame_submission: TLShapeId[] = [];

export class SubTemplateUtil extends ShapeUtil<mySubTemplateClass>{
    
    static override type = 'custom_template' as const; 
    override canResize = () => true;
    override isAspectRatioLocked = () => false;
    override canSnap = () => true;
    
    // Allow the shape to be dropped on the template provided it is not a custom template
    override canDropShapes = (frame: mySubTemplateClass, shapes: TLShape[]) =>{
        if(shapes.every((s) => s.type !='custom_template')){
            return true;
        }
        return false;
    }


    // When a shape is dragged over the custom_template
    override onDragShapesOver = (frame: mySubTemplateClass, shapes: TLShape[]) =>{
        // If the shape that's being dragged over is not a child of the frame
        if(!shapes.every((child)=> child.parentId === frame.id)){
            this.editor.reparentShapes(shapes, frame.id)
        }
    }

    // When a shape are dragged out of the custom_template
    override onDragShapesOut = (shape: mySubTemplateClass, shapes: TLShape[])=>{
        // Change the parentID of that shape
        this.editor.reparentShapes(shapes, this.editor.getCurrentPageId())
    }

    override onHandleDrag = (frame: mySubTemplateClass) => {
        console.log("OVER");
    }
    

    static override props: ShapeProps<mySubTemplateClass> = {
        h: T.number,
        name: T.string,
        w: T.number,
        students: T.number,
        submissions: T.number,
        description: T.string,
        dueDate: T.string,
    };
    

    //default props
    getDefaultProps(): mySubTemplateClass['props'] {
        return {
            h: screen.height,
            name: 'Page_name',
            w: screen.width,
            students: 2,
            submissions: 1,
            description: 'Description',
            dueDate: 'Due Date',
        }
    }

    // Used to calculate shape's geometry for hit-testing, bindings and other geo calculations
    getGeometry(frame: mySubTemplateClass) {
		return new Rectangle2d({
			width: frame.props.w,
			height: frame.props.h,
			isFilled: true,
		})
	}

    
    // When user hovers over it or selects it
    indicator(frame: mySubTemplateClass) {
		return <rect width={frame.props.w} height={frame.props.h} />
	}

    override onResize: TLOnResizeHandler<mySubTemplateClass> = (shape, info) => {
		return resizeBox(shape, info)
	}


    override onBeforeCreate = (frame: mySubTemplateClass) => {
        if (this.editor) {
            const frameSpacing = 80;
           
            for (let i = 0; i < frame.props.students; i++) {
                console.log(i);
                const submission_id = createShapeId(Math.random().toString());
                const xOffset = 0;
                const yOffset = (frameSpacing) * i;

                this.editor.createShapes([
                    {
                        id: submission_id,
                        type: 'submission_frame',
                        x: frame.x + xOffset,
                        y: frame.y + yOffset,
                        props: {
                            w: 200,
                            h: 200,
                            name: String(i),
                        },
                        parentId: frame.id,
                    },
                ]);
                frame_submission.push(submission_id);
            } 
        }
    }



    component(frame: mySubTemplateClass) {
        useEffect(() => {
            this.editor.bringForward(frame_submission);
            frame_submission = [];
        }, [frame.id]);
        
        return (
            
            <HTMLContainer 
                style={{
                        padding: 16,
                        height: frame.props.h,
                        width: frame.props.w,
                        pointerEvents: 'all',
                        backgroundColor: 'black',
                        color: 'whitesmoke',
                        border: '3px solid whitesmoke',
                        overflow: 'hidden',
                        zIndex: 0,
                }}
            >

                <div className="container">
                    <div className="student_submissions">
                        {Array.from({length: frame.props.students}, (_,index) =>(
                            <div key={index}>
                                Student ID: {index + 1}
                            </div>
                        ))}
                    </div>
                    

                    id: {frame.id}
                    student: {frame.props.students}
                    name: {frame.props.name}
                </div>   

            </HTMLContainer>
        )
    }
}

