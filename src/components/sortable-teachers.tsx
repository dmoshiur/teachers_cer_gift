'use client';
import {DndContext,closestCenter,KeyboardSensor,PointerSensor,useSensor,useSensors,type DragEndEvent} from '@dnd-kit/core';
import {SortableContext,useSortable,verticalListSortingStrategy,sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {GripVertical} from 'lucide-react';
import type {Teacher} from '@/templates/registry';
type Row=Teacher & {id:string};
export function SortableTeachers({rows,onReorder,render}:{rows:Row[];onReorder:(oldIndex:number,newIndex:number)=>void;render:(row:Row)=>React.ReactNode}){const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:5}}),useSensor(KeyboardSensor,{coordinateGetter:sortableKeyboardCoordinates}));function end(e:DragEndEvent){if(e.over&&e.active.id!==e.over.id)onReorder(rows.findIndex(r=>r.id===e.active.id),rows.findIndex(r=>r.id===e.over!.id))}return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={end}><SortableContext items={rows.map(r=>r.id)} strategy={verticalListSortingStrategy}><div className="teacher-list">{rows.map(row=><SortableRow key={row.id} id={row.id}>{render(row)}</SortableRow>)}</div></SortableContext></DndContext>}
function SortableRow({id,children}:{id:string;children:React.ReactNode}){const {attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id});return <div ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging?.6:1}} className="sortable-row"><button className="drag-handle" {...attributes} {...listeners} aria-label="Reorder teacher"><GripVertical size={16}/></button>{children}</div>}
