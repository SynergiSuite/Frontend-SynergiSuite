"use client"
import { Button } from "@/global/buttons"
export default function Testing() {
    return (
        <>

        <div className="flex flex-row justify-between">
            <div className="h-full w-[25%]"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border_primary component_styling component_container_square">
                    <Button className="button_primary_lg">Dynamic Button</Button>
                    <button className=" my-6 mx-6 button_primary_lg">button-lg</button>
                    <button className=" my-6 mx-6 button_primary_xl">button-xl</button>
                    <h3 className="my-6 mx-6 component_heading">Component Heading</h3>
                    <h4 className="my-6 mx-6 normal_heading">Normal Heading</h4>
                    <p className="my-6 mx-6 under_heading">Under Heading</p>
                </div>
        
                <div className="border_primary component_styling component_container_square">
                    <button className=" my-6 mx-6 button_primary_lg">button-lg</button>
                    <button className=" my-6 mx-6 button_primary_xl">button-xl</button>
                    <h3 className="my-6 mx-6 component_heading">Component Heading</h3>
                    <h4 className="my-6 mx-6 normal_heading">Normal Heading</h4>
                    <p className="my-6 mx-6 under_heading">Under Heading</p>
                </div>

                <div className="border_primary component_styling component_container_square">
                    <button className=" my-6 mx-6 button_primary_lg">button-lg</button>
                    <button className=" my-6 mx-6 button_primary_xl">button-xl</button>
                    <h3 className="my-6 mx-6 component_heading">Component Heading</h3>
                    <h4 className="my-6 mx-6 normal_heading">Normal Heading</h4>
                    <p className="my-6 mx-6 under_heading">Under Heading</p>
                </div>
            </div>
        </div>
        </>
    )
}