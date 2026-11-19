'use client';
import { TemplateFrame, type Teacher, type TemplateId } from '@/templates/registry';
export function FullPreview({id,teacher}:{id:TemplateId;teacher:Teacher}){return <div className="full-preview"><TemplateFrame id={id} teacher={teacher} scale={.8}/></div>}
