import {
    BaseBoxShapeUtil, HTMLContainer, ShapeProps, T, TLBaseShape, TLFrameShape, FrameShapeUtil, DefaultColorStyle,
    ShapeUtil, Rectangle2d, Editor, TLShape, createShapeId, TLAssetId,
    resizeBox,
    TLOnResizeHandler,
    StateNode,
    TLAsset,
    TldrawUiInput
} from "tldraw";

import { getLocalStorageItem, InputData } from './LocalStorage'

type mySubmissionFrameProps = {
    h: number;
    w: number;
    name: string;
    filled: boolean;
    submissions: number;
};

type mySubmissionFrameClass = TLBaseShape<'submission_frame', mySubmissionFrameProps>;

/**
 * This is the submission frame for each of the students
 */

export class SubmissionFrameUtil extends ShapeUtil<mySubmissionFrameClass> {

    static override type = 'submission_frame' as const;
    override canResize = () => true;
    override isAspectRatioLocked = () => false;
    override canSnap = () => true;
    override canEdit = () => true;
    override canDropShapes = () => true;    // Allow any shape to be dropped on the submission_frame shape 
    override canBind = () => true;         
    override canReceiveNewChildrenOfType = () => true;


    // When a shape is dragged over the submission_frame
    override onDragShapesOver = (frame: mySubmissionFrameClass, shapes: TLShape[]) => {

        for (let i = 0; i < shapes.length; i++) {
            if (shapes[i].parentId != frame.id) {
                this.editor.reparentShapes([shapes[i]], frame.id);

                // Only accept text or images
                if (shapes[i].type === 'image' || shapes[i].type === 'text') {
                    this.editor.reparentShapes([shapes[i]], frame.id);

                    // Resize the image or text shape
                    this.editor.updateShape({
                        id: shapes[i].id,
                        type: shapes[i].type,
                        x: frame.x,
                        y: frame.y,
                        props: {
                            ...shapes[i].props,
                            w: 170,
                            h: 170, // Have to change manually here <---
                        },
                    });

                    // Change color of the submission_frame
                    this.editor.updateShape({
                        id: frame.id,
                        type: 'submission_frame',
                        props: {
                            ...frame.props, // Keep the other props
                            filled: true,
                        }
                    });

                }
            }
        }
    }

    // When a shape are dragged out of the custom_template
    override onDragShapesOut = (frame: mySubmissionFrameClass, shapes: TLShape[]) => {
        // Change the parentID of that child shape
        this.editor.reparentShapes(shapes, this.editor.getCurrentPageId())
        // Change color if no child is left
        if (!this.editor.getSortedChildIdsForParent(frame.id).length) {
            this.editor.updateShape({
                id: frame.id,
                type: 'submission_frame',
                props: {
                    ...frame.props, // Keep the other props
                    filled: false,
                }
            });
        }
       
    }

    static override props: ShapeProps<mySubmissionFrameClass> = {
        h: T.number,
        name: T.string,
        w: T.number,
        filled: T.boolean,
        submissions: T.number,
    };

    //default props
    getDefaultProps(): mySubmissionFrameClass['props'] {
        return {
            h: 200,
            name: 'student_name',
            w: 200,
            filled: false,
            submissions: 1,
        }
    }

    // Used to calculate shape's geometry for hit-testing, bindings and other geo calculations
    getGeometry(frame: mySubmissionFrameClass) {
        return new Rectangle2d({
            width: frame.props.w,
            height: frame.props.h,
            isFilled: true,
        })
    }


    // When user hovers over it or selects it
    indicator(frame: mySubmissionFrameClass) {
        return <rect width={frame.props.w} height={frame.props.h} />
    }

    override onResize: TLOnResizeHandler<mySubmissionFrameClass> = (shape, info) => {
        return resizeBox(shape, info)
    }

    // 1. Creates an array with length = number of submissions
    // 2. Iterates through every element in that array to populate undefined elements into elements with the same values as its indexes
    // 3. Takes in array, filters the elements (NOT INDEXES) and returns out new array with index > 0
    // 4. Maps through the new array and creates a divider for each element
    component(submission: mySubmissionFrameClass) {
        const borderColor = submission.props.filled ? 'green' : 'red';

        const nameChange = (value: string) => {
            this.editor.updateShape({
                id: submission.id,
                type: 'submission_frame',
                props: {
                    ...submission.props,
                    name: value,
                }
            });
        }

        return (
            <HTMLContainer
                style={{
                    height: submission.props.h,
                    width: submission.props.w,
                    pointerEvents: 'all',
                    backgroundColor: 'black',
                    color: 'whitesmoke',
                    border: '3px solid',
                    borderColor: borderColor,
                    borderRadius: '2%',
                    overflow: 'hidden',
                    zIndex: 0,
                }}
            >
                <div className="name">
                    <TldrawUiInput onValueChange={(value) => nameChange(value)} defaultValue={submission.props.name}
                        className="name_input">
                    </TldrawUiInput>
                </div>
                {[...Array(submission.props.submissions)].map((_, index1) => index1).filter(element => element > 0).map((ele) => (
                    <div
                        key={`divider-${ele}`}
                        className='divider'
                        style={{
                            width: submission.props.w,
                            borderBottom: '2px solid white',
                            height: (submission.props.h - 40) / submission.props.submissions,

                        }}
                    />
                ))}

            </HTMLContainer>
        )
    }


}