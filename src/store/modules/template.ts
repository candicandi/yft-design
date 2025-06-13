import { defineStore } from 'pinia'
import { Templates } from '@/mocks/templates'
import { Template, CanvasElement, ImageElement, GroupElement, RectElement } from '@/types/canvas'
import { FabricObject, SerializedImageProps, FabricImage, Group, StaticCanvas } from 'fabric'
import { WorkSpaceDrawType, propertiesToInclude } from '@/configs/canvas'
import { useMainStore } from './main'
import { ElementNames } from '@/types/elements'
import { ElLoading } from 'element-plus'
import { Snapshot, SnapshotType } from '@/types/history'
import useCanvasScale from '@/hooks/useCanvasScale'
import useCanvas from '@/views/Canvas/useCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCommon from '@/views/Canvas/useCommon'


interface UpdateElementData {
  id: string | string[]
  left?: number
  top?: number
  props: Partial<CanvasElement>
}

export interface TemplatesState {
  templateId: string
  templates: Template[]
  templateIndex: number
  templateCanvas: Map<string, StaticCanvas>
}

export const useTemplatesStore = defineStore('Templates', {
  state: (): TemplatesState => ({
    // theme: theme, // 主题样式
    templateId: '',
    templates: Templates, // 页面页面数据
    templateIndex: 0, // 当前页面索引
    templateCanvas: new Map()
    // fixedRatio: false, // 固定比例
    // slideUnit: 'mm', // 尺寸单位
    // slideName: '', // 模板名称
    // slideId: '', // 模板id
  }),

  getters: {
    currentTemplate(state) {
      return state.templates[state.templateIndex] as Template
    },

    currentTemplateWidth(state) {
      const currentTemplate = state.templates[state.templateIndex]
      return currentTemplate.width / currentTemplate.zoom
    },

    currentTemplateHeight(state) {
      const currentTemplate = state.templates[state.templateIndex]
      return currentTemplate.height / currentTemplate.zoom
    },

    // currentTemplateElement(state) {
    //   const currentTemplate = state.templates[state.templateIndex]
    //   const [ canvas ] = useCanvas()
    //   const activeObject = canvas.getActiveObject() as CanvasElement
    //   return currentTemplate.objects.filter(ele => ele.id === activeObject.id)[0]
    // }
  },

  actions: {
    async renderTemplate() {
      const [ canvas ] = useCanvas()
      const { initCommon } = useCommon()
      const { setCanvasSize } = useCanvasScale()
      await canvas.loadFromJSON(this.currentTemplate)
      this.setObjectFilter(this.currentTemplate.objects as CanvasElement[])
      setCanvasSize()
      initCommon()
    },

    async renderElement() {
      const [ canvas ] = useCanvas()
      const { initCommon } = useCommon()
      const { setCanvasSize } = useCanvasScale()
      const mainStore = useMainStore()
      canvas.discardActiveObject()
      mainStore.setCanvasObject(undefined)
      await canvas.loadFromJSON(this.currentTemplate)
      setCanvasSize()
      initCommon()
    },

    modifedElement(target: FabricObject, options: Record<string, any>,) {
      const [ canvas ] = useCanvas()
      const { addHistorySnapshot } = useHistorySnapshot()
      const index = canvas._objects.findIndex(item => item.id === target.id)
      const data: Snapshot = {
        type: SnapshotType.MODIFY,
        index,
        target: target.toObject(propertiesToInclude),
        tid: this.templateId
      }
      const proxyEl: any = this.currentTemplate.objects.find(i => i.id === target.id)
      addHistorySnapshot(data)
      target.set({...options});
      // 更新target同时更新template的对象
      if (proxyEl) {
        Object.keys(options).forEach((key) => {
          if (key in proxyEl) {
            proxyEl[key] = options[key]
          }
        })
      }
      if (options.filters) {
        (target as FabricImage).applyFilters();
      }
      canvas.setActiveObject(target)
      canvas.renderAll()
    },

    addElement(target: FabricObject) {
      const [ canvas ] = useCanvas()
      const { addHistorySnapshot } = useHistorySnapshot()
      const data: Snapshot = {
        type: SnapshotType.ADD,
        index: canvas._objects.indexOf(target),
        target: target.toObject(propertiesToInclude),
        tid: this.templateId
      }
      addHistorySnapshot(data)
    },

    groupElement(target: FabricObject, objects: FabricObject[]) {
      const [ canvas ] = useCanvas()
      const { addHistorySnapshot } = useHistorySnapshot()
      const data: Snapshot = {
        type: SnapshotType.GROUP,
        index: canvas._objects.indexOf(target),
        target: target.toObject(propertiesToInclude),
        objects: objects.map(item => item.toObject(propertiesToInclude)),
        tid: this.templateId
      }
      addHistorySnapshot(data)
    },

    ungroupElement() {

    },

    deleteElement(target: FabricObject) {
      const [ canvas ] = useCanvas()
      const { addHistorySnapshot } = useHistorySnapshot()
      const data: Snapshot = {
        type: SnapshotType.DELETE,
        index: canvas._objects.indexOf(target),
        target: target.toObject(propertiesToInclude),
        tid: this.templateId
      }
      canvas.remove(target)
      canvas.renderAll()
      addHistorySnapshot(data)
    },

    setClip(clip: number) {
      const { addHistorySnapshot } = useHistorySnapshot()
      this.templates.forEach(template => {
        template.clip = clip
      })
      // addHistorySnapshot()
    },

    setSize(width: number, height: number, zoom: number) {
      const { initCommon } = useCommon()
      const { addHistorySnapshot } = useHistorySnapshot()
      this.templates.forEach(template => {
        template.width = width
        template.height = height
        template.zoom = zoom
        template.objects.filter(item => item.id === WorkSpaceDrawType).map(ele => {
          ele.width = width / zoom
          ele.height = height / zoom
        })
      })
      initCommon()
      // addHistorySnapshot()
    },

    setObjectFilter(objects: CanvasElement[]) {
      objects.forEach(ele => {
        if (ele.type.toLowerCase() === ElementNames.IMAGE) {
          this.setImageFilter(ele as ImageElement)
          // this.setImageMask(ele as ImageElement)
        }
        if (ele.type.toLowerCase() === ElementNames.GROUP) {
          this.setObjectFilter(((ele as GroupElement).objects) as CanvasElement[])
        }
      })
    },

    setImageFilter(image: ImageElement) {
      if (!image.pixiFilters) return
      const [ pixi ] = usePixi()
      pixi.postMessage({
        id: image.id,
        type: "filter", 
        src: image.src, 
        pixiFilters: JSON.stringify(image.pixiFilters), 
        width: image.width, 
        height: image.height
      });
    },

    setImageMask(image: ImageElement) {
      if (!image.mask) return
      const [ pixi ] = usePixi()
      pixi.postMessage({
        id: image.id,
        type: "mask", 
        src: image.src,
        mask: JSON.stringify(image.mask), 
        width: image.width, 
        height: image.height
      });
    },

    async changeTemplate(template: Template | Template[]) {
      const { setCanvasTransform } = useCanvasScale()
      const templates = Array.isArray(template) ? template : [template]
      this.templates = templates
      this.templateIndex = 0
      await this.renderTemplate()
      setCanvasTransform()
    },

    setTemplates(templates: Template[]) {
      this.templates = templates
    },

    setTemplateId(templateId: string) {
      this.templateId = templateId
    },

    setTemplateIndex(index: number) {
      this.templateIndex = index
    },

    async addTemplate(template: Template | Template[]) {
      const templates = Array.isArray(template) ? template : [template]
      const addIndex = this.templateIndex + 1
      this.templates.splice(addIndex, 0, ...templates)
      this.templateIndex = addIndex
      await this.renderTemplate()
    },

    updateTemplate(props: Partial<Template>) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const templateIndex = this.templateIndex
      this.templates[templateIndex] = { ...this.templates[templateIndex], ...props }
      // addHistorySnapshot()
    },

    deleteTemplate(templateId: string | string[]) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const templateIds = Array.isArray(templateId) ? templateId : [templateId]
  
      const deleteTemplatesIndex = []
      for (let i = 0; i < templateIds.length; i++) {
        const index = this.templates.findIndex(item => item.id === templateIds[i])
        deleteTemplatesIndex.push(index)
      }
      let newIndex = Math.min(...deleteTemplatesIndex)
  
      const maxIndex = this.templates.length - templateIds.length - 1
      if (newIndex > maxIndex) newIndex = maxIndex
  
      this.templateIndex = newIndex
      this.templates = this.templates.filter(item => !templateIds.includes(item.id))
      // addHistorySnapshot()
    },

    clearTemplate() {
      const objects = this.templates[this.templateIndex].objects.filter(item => item.id === WorkSpaceDrawType)
      this.templates[this.templateIndex].objects = objects
      this.renderTemplate()
    },

    updateWorkSpace(props: Partial<Template>) {
      const templateIndex = this.templateIndex
      this.templates[templateIndex] = { ...this.templates[templateIndex], ...props }
    },

    updateElement(data: UpdateElementData) {
      const { addHistorySnapshot } = useHistorySnapshot()
      const { id, props } = data
      const elementIds = typeof id === 'string' ? [id] : id
      if (!elementIds) return
      const template = this.templates[this.templateIndex]
      const elements = template.objects.map(el => elementIds.includes(el.id) ? { ...el, ...props }: el)
      this.templates[this.templateIndex].objects = elements as FabricObject[]
      // addHistorySnapshot()
    },

    // addElement(element: FabricObject | FabricObject[]) {
    //   const { addHistorySnapshot } = useHistorySnapshot()
    //   const elements = Array.isArray(element) ? element : [element]
    //   const currentTemplateElements = this.templates[this.templateIndex].objects
    //   const newElements = [...currentTemplateElements, ...elements]
    //   this.templates[this.templateIndex].objects = newElements as FabricObject[]
    //   addHistorySnapshot()
    // },

    // deleteElement(elementId: string | string[]) {
    //   const { addHistorySnapshot } = useHistorySnapshot()
    //   const elementIds = Array.isArray(elementId) ? elementId : [elementId]
    //   const currentTemplateElements = this.templates[this.templateIndex].objects
    //   const newElements = currentTemplateElements.filter(item => !elementIds.includes(item.id))
    //   this.templates[this.templateIndex].objects = newElements
    //   addHistorySnapshot()
    // },

    setBackgroundImage(props: SerializedImageProps) {
      this.currentTemplate.backgroundImage = props
    },

  }
})
