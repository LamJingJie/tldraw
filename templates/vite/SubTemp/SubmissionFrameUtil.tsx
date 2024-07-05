import {
    BaseBoxShapeUtil, HTMLContainer, ShapeProps, T, TLBaseShape, TLFrameShape, FrameShapeUtil, DefaultColorStyle,
    ShapeUtil, Rectangle2d, Editor, TLShape, createShapeId, TLAssetId,
    resizeBox,
    TLOnResizeHandler,
    StateNode,
    TLAsset
} from "tldraw";

type mySubmissionFrameProps = {
    h: number;
    w: number;
    name: string;
    filled: boolean;
};

type mySubmissionFrameClass = TLBaseShape<'submission_frame', mySubmissionFrameProps>;

export class SubmissionFrameUtil extends ShapeUtil<mySubmissionFrameClass> {

    static override type = 'submission_frame' as const;
    override canResize = () => true;
    override isAspectRatioLocked = () => false;
    override canSnap = () => true;

    // Allow any shape to be dropped on the submission_frame shape 
    override canDropShapes = (frame: mySubmissionFrameClass, shapes: TLShape[]) => {
        return true;
    }

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
        // Change color
        this.editor.updateShape({
            id: frame.id,
            type: 'submission_frame',
            props: {
                ...frame.props, // Keep the other props
                filled: false,
            }
        })
    }

    static override props: ShapeProps<mySubmissionFrameClass> = {
        h: T.number,
        name: T.string,
        w: T.number,
        filled: T.boolean,
    };

    //default props
    getDefaultProps(): mySubmissionFrameClass['props'] {
        return {
            h: 200,
            name: 'student_name',
            w: 200,
            filled: false,
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

    component(submission: mySubmissionFrameClass) {
        const borderColor = submission.props.filled ? 'green' : 'red';

        return (
            <HTMLContainer
                style={{
                    padding: 16,
                    height: submission.props.h,
                    width: submission.props.w,
                    pointerEvents: 'all',
                    backgroundColor: 'black',
                    color: 'whitesmoke',
                    border: '3px solid',
                    borderColor: borderColor,
                    borderRadius: '5%',
                    overflow: 'hidden',
                    zIndex: 0,
                }}
            >
                <div>
                    {submission.props.name}
                </div>
            </HTMLContainer>
        )
    }


}