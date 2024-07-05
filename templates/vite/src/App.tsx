import { Tldraw, DefaultColorThemePalette, useEditor, Editor, TLGeoShape, createShapeId, AssetRecordType, TLAssetId, TLUiOverrides, useTools, useIsToolSelected, DefaultToolbar, TldrawUiMenuItem, DefaultToolbarContent, TLComponents } from 'tldraw'
DefaultColorThemePalette.lightMode.black.solid = 'white'
import { SubTemplateTool } from '../SubTemp/SubTemplateTool'
import { components, customAssetUrls,toolsOverride  } from '../SubTemp/ui-overrides'
import { SubmissionFrameUtil } from '../SubTemp/SubmissionFrameUtil'

const submissionUtil = [SubmissionFrameUtil];
const tools = [SubTemplateTool];

function App() {
	let editor_main: Editor;
	

	//Intializer
	const handleMount = (editor: Editor) => {
		editor_main = editor;
	
		/*editor_main.registerExternalContentHandler("files", (data) => {
			console.log(data);
		});*/
	}

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw 
				inferDarkMode
				shapeUtils={submissionUtil} 
				tools={tools} 
				
				overrides={toolsOverride}
				assetUrls={customAssetUrls}
				components={components}
				persistenceKey='board-content' 

				className="board" 
				onMount={handleMount} />
		</div>
	)
}

export default App
