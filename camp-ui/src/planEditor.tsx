import {Plan} from "../../camp-dsl/src/api/parser.ts"
import {useState} from "react"
import {DslEditor} from "../../camp-dsl/src"
import {PlanView} from "./planView.tsx"
import {MealsProvider} from "./meals.ts"
import {filter, first, pipe} from "remeda"
import {DangerousButton} from "./dangerousButton.tsx"

const external = {
    MealProvider: () => new MealsProvider(),
} as const

const demoSrc = `
Thursday (4):
    -
    -
    quesadilla
Friday (4):
    scrambled eggs with tomatoes
    toasts
    hamburgers (5), veggie burgers (1)
Saturday:
    shakshuka (6)
    curry wurst (5), veggie curry wurst (1)
    chili con carne (5), veggie burgers (1)
Sunday (6):
    scrambled eggs with tomatoes
    toasts (5), veggie toasts (1)
    prazonka (6)
Monday:
    scrambled eggs with tomatoes (6)
    quesadilla (5), veggie quesadilla (1)
`.trim()

const initial = pipe(
    [
        decodeURIComponent(location.search.replace(/^[?]src=/, "")),
        localStorage.getItem("src"),
        demoSrc,
    ],
    filter(it => !!it),
    first(),
)!


export function PlanEditor(props: { onChange: (plan: Plan[]) => void }) {
    const [plan, setPlan] = useState<Plan[]>([])
    const [src, setSrc] = useState(initial)
    return <div style={{display: "flex", flexDirection: "column", position: "absolute", inset: 0}}>
        <div style={{flex: 2, display: "flex", flexDirection: "row"}}>
            <DslEditor onChange={(value, text) => {
                setPlan(value)
                props.onChange(value)
                setTimeout(() => {
                    history.replaceState(null, "", `?src=${encodeURIComponent(text)}`)
                    localStorage.setItem("src", text)
                }, 0)
            }} importMetaUrl={import.meta.url} external={external}>
                {src}
            </DslEditor>
        </div>
        <div style={{flex: 1, padding: 8, overflow: "auto"}}>
            <PlanView plan={plan}/>
            <DangerousButton onClick={() => {
                localStorage.clear()
                setSrc("")
            }}>Reset</DangerousButton>
            <a href="https://github.com/rzymek/camp-menu/blob/main/camp-ui/src/meals.md" target="_blank"
               style={{margin: 8}}>Source</a>
        </div>
    </div>

}