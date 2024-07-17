import {
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
	DefaultStylePanel,
	DefaultStylePanelContent,
	DefaultToolbar,
	DefaultToolbarContent,
	TLComponents,
	TLUiAssetUrlOverrides,
	TLUiOverrides,
	TldrawUiInput,
	TldrawUiMenuItem,
	useIsToolSelected,
	useRelevantStyles,
	useTools,
	TLUiStylePanelProps,
	TldrawUiButton,
	Editor,
	TLShapeId,
} from 'tldraw'
import { getLocalStorageItem_input, setLocalStorageItem_input, InputData, setLocalStorageItem_student_list, getLocalStorageItem_student_list } from './LocalStorage';
import React, { useEffect, useState } from 'react';

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
function CustomStylePanel(props: TLUiStylePanelProps, editor: Editor) {
	const styles = useRelevantStyles();
	const tools = useTools();
	const isCustomTemplateSelected = useIsToolSelected(tools['template']);

	// State management, use state when you wish to rerender the UI when the state changes
	const [isStudentShown, setIsStudentShown] = useState(false);
	const [student_list, setStudentList] = useState<string[]>(getLocalStorageItem_student_list());
	const [amtOfStudents, setAmtOfStudents] = useState<number>();
	const [amtOfSections, setAmtOfSections] = useState<number>();
	
	const [selectedId, setSelectedId] = useState<number | null>(null);

	let input_data: InputData = getLocalStorageItem_input();
	

	// References
	// used to access the DOM element directly like an input field data
	const studentNameInputRef = React.createRef<HTMLInputElement>();

	// used when you wish to preserve data when component re-renders but do not need to rerender the UI when the data changes
	// and when you want it to be synchronous (instant)
	const focusedInputRef = React.useRef<HTMLInputElement[]>([]);
	const currPointer = React.useRef<number>(getLocalStorageItem_student_list().length - 1); // start at the last index
	 

	useEffect(() => {

		// If the user clicks anywhere outside of the student item, remove all styling and reset current selected item to the last index
		const handleClickOutside = (event: any) => {
			// Remove styling outside of student item ('click' class)
			if (!event.target.classList.contains('click')) {
				setSelectedId(null);
			}
		}
		document.addEventListener('click', handleClickOutside);

		// Determine which input field to focus on
		focusInput();
		selectedId === null && (currPointer.current = student_list.length - 1);

		// Count the number of students and sections
		let counter_student: number = 0;
		let total_section: number = 1;
		let updatedList	= [...student_list];
		for (let i = 0; i < student_list.length; i++) {
			student_list[i] === '' ? total_section++ : counter_student++;
			// Remove empty sections that are next to each other
			if(i + 1 < student_list.length && student_list[i] === '' && student_list[i + 1] === ''){
				updatedList.splice(i , 1);
				setStudentList(updatedList);
			}
		}
		setAmtOfStudents(counter_student);
		setAmtOfSections(total_section);
		setLocalStorageItem_student_list(student_list);

		// Cleanup when component unmounts or re-renders
		return () =>{
			document.removeEventListener('click', handleClickOutside);
		};
	}, [student_list, selectedId]) //Rerun when student_list and selected student id changes


	const focusInput = () =>{
		if(selectedId !== null && focusedInputRef.current[selectedId]){
			//console.log("focused");
			focusedInputRef.current[selectedId].focus();
		}
	}


	// **Students list functionalities**
	const seeStudents = () => {
		setIsStudentShown(!isStudentShown)
	}


	const addStudent = () => {
		
		// Check if null, if not, get the value
		if (studentNameInputRef.current) {

			let updatedList: string[] = [...student_list]; //shallow copy
			let nextVal: string = updatedList[currPointer.current + 1];
			let currVal: string = updatedList[currPointer.current];
			if (((nextVal === '' || currVal === '') && studentNameInputRef.current.value === '') || 
				(updatedList.length === 0 && studentNameInputRef.current.value === '')){
				alert("Must have at least 1 student name in every section");
				return;
			}
			updatedList.splice(currPointer.current + 1, 0, studentNameInputRef.current.value);
			setStudentList(updatedList);
		}
	}


	const deleteStudent = (index: any) => {
		let updatedList: string[] = [...student_list];
		updatedList.splice(index, 1);
		if(updatedList[0] === ''){
			updatedList.shift();
		}
		setStudentList(updatedList);
	}


	const editStudent = (value: any, index: number) => {
		let updatedList: string[] = [...student_list]; //Shallow copy
		value === '' ? updatedList.splice(index, 1) : updatedList[index] = value;
		setStudentList(updatedList);
	}


	// When a student item is selected, add margin-bottom to the selected items
	const selectStudItem = (index: number) => {
		//console.log('selected')

		// Refocus on the input field again if the user clicks on the same item
		if (index === selectedId){
			focusInput();
		}else{
			setSelectedId(index);
		}
		currPointer.current = index;
	}
	// **End of Students list functionalities**




	const inputChange = (value: string, inputId: string) => {
		switch (inputId) {
			case 'stud':
				// If parseInt returns NaN or 0, return 1 instead
				input_data.students = parseInt(value) ? parseInt(value) : 1;
				break;

			case 'sub':
				// Parseint returns all int values before a string
				input_data.submissions = parseInt(value) ? parseInt(value) : 1;
				break;

			case 'desc':
				input_data.description = value;
				break;

			case 'date':
				input_data.dueDate = value;
				break;

			default:
				break;
		}
		setLocalStorageItem_input(input_data);
	}


	// Functional Component (must return anything that can be rendered to the DOM)
	const StudentListComponent = ({ }) => {
		const calculateSectionNumber = (index: number): number => {
			let sectionCounter: number = 2;
			// Loop through and count how many sections before the current index where the input is empty
			for (let i = 0; i < index; i++) {
				student_list[i] === '' && sectionCounter++;
			}
			return sectionCounter;
		};

		return (
			<div style={{ borderTop: '2px solid whitesmoke' }}>
				<h3 style={{ marginBottom: '0', textAlign: 'center' }}>You have <b style={{fontSize: '20px'}}>'{amtOfSections}'</b> section(s)</h3>
				<ul id="student_list">
					{/* List of students added */}
					{student_list.map((ele: string, index1: number) => {
						const itemStyles = {
							padding: '3px',
							display: 'flex',
							alignItems: 'center',
							width: '100%',
							// When user selects a student item, when state is updated, re-render the UI with the selected item
							...(selectedId === index1 ? { marginBottom: '80px',  backgroundColor: 'rgb(44, 44, 44)'} : {})
						};
						return (
							<li 
								className='student_item click' 
								style={itemStyles} 
								key={index1} >
								<TldrawUiButton 
									type='normal' 
									className='click' 
									style={{ width: '100%', paddingLeft: '0px' }}
									onClick={() => selectStudItem(index1)} >
									{ele !== '' ? (
										<div style={{display:'flex', width:'100%', gap: '12px'}} className='click'>
											<label className='click'>Name:</label>
											<input 
												className='input_style click' 
												defaultValue={ele} 
												placeholder='username'
												onChange={(e) => editStudent(e.target.value, index1)}
												// Dynamically generate Refs for each input field, keep track of which input field is focused
												ref= {(el) => focusedInputRef.current[index1] = el as HTMLInputElement}
											/>
										</div>
									) : (
										<h2 className="sectionHeader click">Section {calculateSectionNumber(index1)}</h2>
									)}
								</TldrawUiButton>
								<TldrawUiButton 
									className={ele === '' ? 'sectionHeader' : undefined} 
									id="rmvBtn" 
									type='low' 
									onClick={() => deleteStudent(index1)}>
										Remove
								</TldrawUiButton>
							</li>
						)
					})}
				</ul>
			</div>
		)
	}

	return (
		<DefaultStylePanel {...props}>

			{isCustomTemplateSelected && (
				<>
					<style>
						{`
                	.tlui-style-panel {
                    	min-width: 350px !important;
						max-width: 900px !important;
                		}
					`}
					</style>
					<div className='style_grp'>
						<h4 className="title" id='template_label'>Add Submission Template</h4>
						<div className="input_grp">
							<div style={{ display: 'flex' }}>
								<TldrawUiInput 
									onValueChange={(value) => inputChange(value, 'stud')} 
									defaultValue={input_data.students.toString()}
									className='input_style' 
									label='Amt Of Students:'>
								</TldrawUiInput>

								<TldrawUiInput 
									onValueChange={(value) => inputChange(value, 'sub')} 
									defaultValue={input_data.submissions.toString()}
									className='input_style' 
									label='Submits Per Student:'>
								</TldrawUiInput>
							</div>
							<TldrawUiInput 
								onValueChange={(value) => inputChange(value, 'date')} 
								defaultValue={input_data.dueDate}
								className='input_style' 
								label='Due Date:'>
							</TldrawUiInput>

							<TldrawUiInput 
								onValueChange={(value) => inputChange(value, 'desc')} 
								defaultValue={input_data.description}
								className='input_style' 
								label='Description:'>
							</TldrawUiInput>

							<div className='dropdown'>
								<div id='student_input'>
									<div style={{ flex: 4 }}>
										{/* Changing the ref prop type from TldrawUiInput to match React */}
										<TldrawUiInput 
											ref={studentNameInputRef as React.Ref<HTMLInputElement>} 
											className='input_style click' 
											label='Student name:'
											placeholder='Empty --> New Section' 
											onValueChange={(value) => inputChange(value, 'stud_name')}>
										</TldrawUiInput>
									</div>
									<div style={{ flex: 1, display: 'flex' }}>
										<TldrawUiButton type='primary' className='click' onClick={() => addStudent()} >ADD</TldrawUiButton>
										{/* Add list of students added and show the number of students added */}
										<button className='dropdown_btn' onClick={() => seeStudents()}>
											Students: {amtOfStudents} {isStudentShown ? '▲' : '▼'}
										</button>
									</div>
								</div>
								{isStudentShown && (
									student_list.length > 0 ? (
										<StudentListComponent />
									) : (
										<h3 id="student_list" style={{ textAlign: 'center', borderTop: '2px solid whitesmoke' }}>Empty Section 1</h3>
									)
								)}
							</div>
						</div>
					</div>
				</>
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