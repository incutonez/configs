import './App.css'
import SVGIcon from "@material-symbols/svg-400/outlined/recommend.svg?react";

function App() {
  return (
    <>
        <div className="flex">
            <SVGIcon className="size-6 fill-blue-600" />
            <span className="text-red-500">Testing</span>
        </div>
    </>
  )
}

export default App
