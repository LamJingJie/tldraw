import {
	DefaultContextMenu,
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
	DefaultStylePanel,
	DefaultStylePanelContent,
	DefaultToolbar,
	DefaultToolbarContent,
	HTMLContainer,
	TLComponents,
	TLUiAssetUrlOverrides,
	TLUiContextMenuProps,
	TLUiOverrides,
	TldrawUiDropdownMenuContent,
	TldrawUiInput,
	TldrawUiMenuGroup,
	TldrawUiMenuItem,
	useEditor,
	TLCursor,
	useIsToolSelected,
	useRelevantStyles,
	useTools,
	stopEventPropagation,
	track,
} from 'tldraw'
import { getLocalStorageItem, setLocalStorageItem, InputData } from './LocalStorage';

/**
 
 * This is where you override the UI of the template
 
**/



// Add/Define a new custom tool
export const toolsOverride: TLUiOverrides = {
	tools(editor, tools) {

		// Create a custom tool 
		// Communicates with the SubTemplateTool.tsx file
		tools.template = {
			id: 'custom_template_id',
			icon: 'custom_template',
			label: 'Custom Submission Template',
			kbd: 'T', //Keyboard Shortcut
			onSelect: () => {
				editor.setCurrentTool('custom_template_id');
			},
		}
		return tools
	},
}

export const customAssetUrls: TLUiAssetUrlOverrides = {
	icons: {
		'custom_template': '../SubTemp/img/tick.png',
	},
}


// Override the context menu with custom content when the custom template tool is selected
function CustomStylePanel(props: TLUiContextMenuProps) {
	const styles = useRelevantStyles();
	const tools = useTools();
	//const editor = useEditor();
	//const isCustomTemplateSelected = editor.getCurrentToolId()==='custom_template1';
	const isCustomTemplateSelected = useIsToolSelected(tools['template']);


	let input_data: InputData = {
		students: getLocalStorageItem() ? getLocalStorageItem().students : 1,
		submissions: getLocalStorageItem() ? getLocalStorageItem().submissions : 1,
		description: getLocalStorageItem() ? getLocalStorageItem().description : '',
		dueDate: getLocalStorageItem() ? getLocalStorageItem().dueDate : '',
	}
	if (!getLocalStorageItem()) {
		console.log("Setting local storage item");
		setLocalStorageItem(input_data);
	}



	const inputChange = (value: string, inputId: string) => {
		switch (inputId) {
			case 'stud':
				// If parseInt returns NaN or 0, return 1 instead
				input_data.students = parseInt(value) ? parseInt(value) : 1;
				setLocalStorageItem(input_data);
				break;

			case 'sub':
				// Parseint returns all int values before a string
				input_data.submissions = parseInt(value) ? parseInt(value) : 1;
				console.log(input_data);
				setLocalStorageItem(input_data);
				break;

			case 'desc':
				input_data.description = value;
				setLocalStorageItem(input_data);
				break;

			case 'date':
				input_data.dueDate = value;
				setLocalStorageItem(input_data);
				break;

			default:
				break;
		}
	}

	return (
		<DefaultStylePanel {...props}>
			{isCustomTemplateSelected && (
				<div className='style_grp'>
					<h4 className="title" id='template_label'>Add Submission Template</h4>
					<div className="input_grp">
						<TldrawUiInput onValueChange={(value) => inputChange(value, 'stud')} defaultValue={input_data.students.toString()}
							className='input_style' label='Amt Of Students:'>
						</TldrawUiInput>

						<TldrawUiInput onValueChange={(value) => inputChange(value, 'sub')} defaultValue={input_data.submissions.toString()}
							className='input_style' label='Submissions Per Student:'>
						</TldrawUiInput>
						
						<TldrawUiInput onValueChange={(value) => inputChange(value, 'desc')} defaultValue={input_data.description}
							className='input_style' label='Description:'>
						</TldrawUiInput>

						<TldrawUiInput onValueChange={(value) => inputChange(value, 'date')} defaultValue={input_data.dueDate}
							className='input_style' label='Due Date:'>
						</TldrawUiInput>
					</div>
				</div>
			)}
			<DefaultStylePanelContent styles={styles} />
		</DefaultStylePanel>
	)
}



export const components: TLComponents = {
	StylePanel: CustomStylePanel,

	// Return Toolbar with the newly added custom template btn and default content
	Toolbar: (props) => {
		const tools = useTools()
		const isCustomTemplateSelected = useIsToolSelected(tools['template'])

		// Return overridden toolbar with custom button and default content
		return (
			<DefaultToolbar {...props}>
				<TldrawUiMenuItem {...tools['template']} isSelected={isCustomTemplateSelected} />
				<DefaultToolbarContent />
			</DefaultToolbar>
		)
	},

	// Update keyboard shortcuts with newly added custom template tool
	KeyboardShortcutsDialog: (props) => {
		const tools = useTools()
		return (
			<DefaultKeyboardShortcutsDialog {...props}>
				<TldrawUiMenuItem {...tools['template']} />
				<DefaultKeyboardShortcutsDialogContent />
			</DefaultKeyboardShortcutsDialog>
		)
	},
}