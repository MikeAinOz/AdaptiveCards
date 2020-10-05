/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import * as d3 from "d3";
import * as _ from "lodash";
import powerbi from "powerbi-visuals-api";

import ISelectionManager = powerbi.extensibility.ISelectionManager;

import { interactivityBaseService as interactivityService, interactivitySelectionService, interactivityUtils } from "powerbi-visuals-utils-interactivityutils";
import appendClearCatcher = interactivityService.appendClearCatcher;
import IInteractiveBehavior = interactivityService.IInteractiveBehavior;
import IInteractivityService = interactivityService.IInteractivityService;
import createInteractivitySelectionService = interactivitySelectionService.createInteractivitySelectionService;
import SelectableDataPoint = interactivitySelectionService.SelectableDataPoint;
import registerStandardSelectionHandler = interactivityUtils.registerStandardSelectionHandler;
import ISelectionHandler = interactivityService.ISelectionHandler;
import ISelectionId = powerbi.extensibility.ISelectionId;
import BaseDataPoint = interactivityService.BaseDataPoint;
import IBehaviorOptions = interactivityService.IBehaviorOptions;

export interface KPIBehaviorOptions extends IBehaviorOptions<BaseDataPoint> {
    clearCatcher: Selection ;
    taskSelection: Selection ;
    interactivityService: IInteractivityService<BaseDataPoint>;
    selectionIdOptions: SelectionIdOption[];
    selectionManager: ISelectionManager;
}
import { SelectionIdOption } from "./visual";
type Selection = d3.Selection<any, any, any, any>;


export class behavior implements IInteractiveBehavior {
    private options: KPIBehaviorOptions;
    private selectionHandler: ISelectionHandler;
    private selectionIdOptions: SelectionIdOption[];

    public bindEvents(options: KPIBehaviorOptions, selectionHandler: ISelectionHandler) {
        this.options = options;
        let clearCatcher: Selection = options.clearCatcher;
        this.selectionHandler = selectionHandler;
        this.selectionIdOptions = options.selectionIdOptions;
        let selectionIdOptions = this.selectionIdOptions;
        let selectionManager = options.selectionManager;
        options.taskSelection.on("click", (d) => {
            const isCrtlPressed: boolean = (<MouseEvent>d3.event).ctrlKey;
            selectionManager.select(d.identity, isCrtlPressed).then((ids: ISelectionId[]) => {});
            // selectionHandler.handleSelection(d.identity, (<MouseEvent>d3.event).ctrlKey);
            (<MouseEvent>d3.event).stopPropagation();
        });

        registerStandardSelectionHandler(options.taskSelection, selectionHandler);

        clearCatcher.on("click", () => {
            selectionHandler.handleClearSelection();
        });
    }

    public renderSelection(hasSelection: boolean) {
        let selectionIdOptions = this.selectionIdOptions;
        this.options.taskSelection.style("opacity", (d) => {
            return (hasSelection && !d.selected) ? 0.5 : 1;
        });
    }
}