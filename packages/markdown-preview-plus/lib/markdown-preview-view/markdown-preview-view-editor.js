"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const util = require("./util");
const markdown_preview_view_1 = require("./markdown-preview-view");
const util_1 = require("../util");
const markdown_preview_view_editor_remote_1 = require("./markdown-preview-view-editor-remote");
class MarkdownPreviewViewEditor extends markdown_preview_view_1.MarkdownPreviewView {
    constructor(editor) {
        super();
        this.editor = editor;
        this.syncPreviewHelper = async () => {
            const pos = this.editor.getCursorBufferPosition().row;
            this.syncPreview(pos);
        };
        this.handleEditorEvents();
    }
    static create(editor) {
        let mppv = MarkdownPreviewViewEditor.editorMap.get(editor);
        if (!mppv) {
            mppv = new MarkdownPreviewViewEditor(editor);
            MarkdownPreviewViewEditor.editorMap.set(editor, mppv);
        }
        return mppv;
    }
    static viewForEditor(editor) {
        return MarkdownPreviewViewEditor.editorMap.get(editor);
    }
    destroy() {
        super.destroy();
        MarkdownPreviewViewEditor.editorMap.delete(this.editor);
    }
    serialize() {
        return {
            deserializer: 'markdown-preview-plus/MarkdownPreviewView',
            editorId: this.editor && this.editor.id,
        };
    }
    getTitle() {
        return `${this.editor.getTitle()} Preview`;
    }
    getURI() {
        return `markdown-preview-plus://editor/${this.editor.id}`;
    }
    getPath() {
        return this.editor.getPath();
    }
    async getMarkdownSource() {
        return this.editor.getText();
    }
    getGrammar() {
        return this.editor.getGrammar();
    }
    didScrollPreview(min, max) {
        if (!this.shouldScrollSync('preview'))
            return;
        if (min === 0) {
            this.editor.scrollToBufferPosition([min, 0]);
        }
        else if (max >= this.editor.getLastBufferRow() - 1) {
            this.editor.scrollToBufferPosition([max, 0]);
        }
        else {
            const range = atom_1.Range.fromObject([[min, 0], [max, 0]]);
            this.editor.scrollToScreenRange(this.editor.screenRangeForBufferRange(range), { center: false });
        }
    }
    openNewWindow() {
        markdown_preview_view_editor_remote_1.MarkdownPreviewViewEditorRemote.open(this.editor);
        util.destroy(this);
    }
    openSource(initialLine) {
        if (initialLine !== undefined) {
            this.editor.setCursorBufferPosition([initialLine, 0]);
        }
        const pane = atom.workspace.paneForItem(this.editor);
        if (!pane)
            return;
        pane.activateItem(this.editor);
        pane.activate();
    }
    handleEditorEvents() {
        this.disposables.add(atom.workspace.onDidChangeActiveTextEditor((ed) => {
            if (util_1.atomConfig().previewConfig.activatePreviewWithEditor) {
                if (ed === this.editor) {
                    const pane = atom.workspace.paneForItem(this);
                    if (!pane)
                        return;
                    const edPane = atom.workspace.paneForItem(ed);
                    if (pane === edPane)
                        return;
                    pane.activateItem(this);
                }
            }
        }), this.editor.getBuffer().onDidStopChanging(() => {
            if (util_1.atomConfig().previewConfig.liveUpdate) {
                this.changeHandler();
            }
            if (util_1.atomConfig().syncConfig.syncPreviewOnChange) {
                util_1.handlePromise(this.syncPreviewHelper());
            }
        }), this.editor.onDidChangePath(() => {
            this.emitter.emit('did-change-title');
        }), this.editor.onDidDestroy(() => {
            if (util_1.atomConfig().previewConfig.closePreviewWithEditor) {
                util.destroy(this);
            }
        }), this.editor.getBuffer().onDidSave(() => {
            if (!util_1.atomConfig().previewConfig.liveUpdate) {
                this.changeHandler();
            }
        }), this.editor.getBuffer().onDidReload(() => {
            if (!util_1.atomConfig().previewConfig.liveUpdate) {
                this.changeHandler();
            }
        }), atom.views.getView(this.editor).onDidChangeScrollTop(() => {
            if (!this.shouldScrollSync('editor'))
                return;
            const [first, last] = this.editor.getVisibleRowRange();
            this.handler.scrollSync(this.editor.bufferRowForScreenRow(first), this.editor.bufferRowForScreenRow(last));
        }), atom.commands.add(atom.views.getView(this.editor), {
            'markdown-preview-plus:sync-preview': this.syncPreviewHelper,
        }));
    }
    shouldScrollSync(whatScrolled) {
        const config = util_1.atomConfig().syncConfig;
        if (config.syncEditorOnPreviewScroll && config.syncPreviewOnEditorScroll) {
            const item = whatScrolled === 'editor' ? this.editor : this;
            const pane = atom.workspace.paneForItem(item);
            return pane && pane.isActive();
        }
        else {
            return ((config.syncEditorOnPreviewScroll && whatScrolled === 'preview') ||
                (config.syncPreviewOnEditorScroll && whatScrolled === 'editor'));
        }
    }
}
MarkdownPreviewViewEditor.editorMap = new WeakMap();
exports.MarkdownPreviewViewEditor = MarkdownPreviewViewEditor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24tcHJldmlldy12aWV3LWVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXJrZG93bi1wcmV2aWV3LXZpZXcvbWFya2Rvd24tcHJldmlldy12aWV3LWVkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpRDtBQUNqRCwrQkFBOEI7QUFDOUIsbUVBQTRFO0FBQzVFLGtDQUFtRDtBQUNuRCwrRkFBdUY7QUFFdkYsK0JBQXVDLFNBQVEsMkNBQW1CO0lBTWhFLFlBQTRCLE1BQWtCO1FBQzVDLEtBQUssRUFBRSxDQUFBO1FBRG1CLFdBQU0sR0FBTixNQUFNLENBQVk7UUF1SXRDLHNCQUFpQixHQUFHLEtBQUssSUFBSSxFQUFFO1lBQ3JDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxHQUFHLENBQUE7WUFDckQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN2QixDQUFDLENBQUE7UUF4SUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7SUFDM0IsQ0FBQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBa0I7UUFDckMsSUFBSSxJQUFJLEdBQUcseUJBQXlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUMxRCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsSUFBSSxHQUFHLElBQUkseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUMseUJBQXlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDdEQ7UUFDRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFTSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQWtCO1FBQzVDLE9BQU8seUJBQXlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUN4RCxDQUFD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QkFBeUIsSUFBSSxNQUFNLENBQUMseUJBQXlCLEVBQUU7WUFDeEUsTUFBTSxJQUFJLEdBQUcsWUFBWSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1lBQzNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzdDLE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtTQUMvQjthQUFNO1lBQ0wsT0FBTyxDQUNMLENBQUMsTUFBTSxDQUFDLHlCQUF5QixJQUFJLFlBQVksS0FBSyxTQUFTLENBQUM7Z0JBQ2hFLENBQUMsTUFBTSxDQUFDLHlCQUF5QixJQUFJLFlBQVksS0FBSyxRQUFRLENBQUMsQ0FDaEUsQ0FBQTtTQUNGO0lBQ0gsQ0FBQzs7QUE3SmMsbUNBQVMsR0FBRyxJQUFJLE9BQU8sRUFHbkMsQ0FBQTtBQUpMLDhEQStKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRleHRFZGl0b3IsIEdyYW1tYXIsIFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHsgTWFya2Rvd25QcmV2aWV3VmlldywgU2VyaWFsaXplZE1QViB9IGZyb20gJy4vbWFya2Rvd24tcHJldmlldy12aWV3J1xuaW1wb3J0IHsgaGFuZGxlUHJvbWlzZSwgYXRvbUNvbmZpZyB9IGZyb20gJy4uL3V0aWwnXG5pbXBvcnQgeyBNYXJrZG93blByZXZpZXdWaWV3RWRpdG9yUmVtb3RlIH0gZnJvbSAnLi9tYXJrZG93bi1wcmV2aWV3LXZpZXctZWRpdG9yLXJlbW90ZSdcblxuZXhwb3J0IGNsYXNzIE1hcmtkb3duUHJldmlld1ZpZXdFZGl0b3IgZXh0ZW5kcyBNYXJrZG93blByZXZpZXdWaWV3IHtcbiAgcHJpdmF0ZSBzdGF0aWMgZWRpdG9yTWFwID0gbmV3IFdlYWtNYXA8XG4gICAgVGV4dEVkaXRvcixcbiAgICBNYXJrZG93blByZXZpZXdWaWV3RWRpdG9yXG4gID4oKVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSBlZGl0b3I6IFRleHRFZGl0b3IpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5oYW5kbGVFZGl0b3JFdmVudHMoKVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBjcmVhdGUoZWRpdG9yOiBUZXh0RWRpdG9yKSB7XG4gICAgbGV0IG1wcHYgPSBNYXJrZG93blByZXZpZXdWaWV3RWRpdG9yLmVkaXRvck1hcC5nZXQoZWRpdG9yKVxuICAgIGlmICghbXBwdikge1xuICAgICAgbXBwdiA9IG5ldyBNYXJrZG93blByZXZpZXdWaWV3RWRpdG9yKGVkaXRvcilcbiAgICAgIE1hcmtkb3duUHJldmlld1ZpZXdFZGl0b3IuZWRpdG9yTWFwLnNldChlZGl0b3IsIG1wcHYpXG4gICAgfVxuICAgIHJldHVybiBtcHB2XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHZpZXdGb3JFZGl0b3IoZWRpdG9yOiBUZXh0RWRpdG9yKSB7XG4gICAgcmV0dXJuIE1hcmtkb3duUHJldmlld1ZpZXdFZGl0b3IuZWRpdG9yTWFwLmdldChlZGl0b3IpXG4gIH1cblxuICBwdWJsaWMgZGVzdHJveSgpIHtcbiAgICBzdXBlci5kZXN0cm95KClcbiAgICBNYXJrZG93blByZXZpZXdWaWV3RWRpdG9yLmVkaXRvck1hcC5kZWxldGUodGhpcy5lZGl0b3IpXG4gIH1cblxuICBwdWJsaWMgc2VyaWFsaXplKCk6IFNlcmlhbGl6ZWRNUFYge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdtYXJrZG93bi1wcmV2aWV3LXBsdXMvTWFya2Rvd25QcmV2aWV3VmlldycsXG4gICAgICBlZGl0b3JJZDogdGhpcy5lZGl0b3IgJiYgdGhpcy5lZGl0b3IuaWQsXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFRpdGxlKCkge1xuICAgIHJldHVybiBgJHt0aGlzLmVkaXRvci5nZXRUaXRsZSgpfSBQcmV2aWV3YFxuICB9XG5cbiAgcHVibGljIGdldFVSSSgpIHtcbiAgICByZXR1cm4gYG1hcmtkb3duLXByZXZpZXctcGx1czovL2VkaXRvci8ke3RoaXMuZWRpdG9yLmlkfWBcbiAgfVxuXG4gIHB1YmxpYyBnZXRQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRvci5nZXRQYXRoKClcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBnZXRNYXJrZG93blNvdXJjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IuZ2V0VGV4dCgpXG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0R3JhbW1hcigpOiBHcmFtbWFyIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IuZ2V0R3JhbW1hcigpXG4gIH1cblxuICBwcm90ZWN0ZWQgZGlkU2Nyb2xsUHJldmlldyhtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuc2hvdWxkU2Nyb2xsU3luYygncHJldmlldycpKSByZXR1cm5cbiAgICBpZiAobWluID09PSAwKSB7XG4gICAgICB0aGlzLmVkaXRvci5zY3JvbGxUb0J1ZmZlclBvc2l0aW9uKFttaW4sIDBdKVxuICAgIH0gZWxzZSBpZiAobWF4ID49IHRoaXMuZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKSAtIDEpIHtcbiAgICAgIHRoaXMuZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24oW21heCwgMF0pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbnN0IG1pZCA9IE1hdGguZmxvb3IoMC41ICogKG1pbiArIG1heCkpXG4gICAgICAvLyB0aGlzLmVkaXRvci5zY3JvbGxUb0J1ZmZlclBvc2l0aW9uKFttaWQsIDBdLCB7IGNlbnRlcjogdHJ1ZSB9KVxuICAgICAgY29uc3QgcmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbbWluLCAwXSwgW21heCwgMF1dKVxuICAgICAgdGhpcy5lZGl0b3Iuc2Nyb2xsVG9TY3JlZW5SYW5nZShcbiAgICAgICAgdGhpcy5lZGl0b3Iuc2NyZWVuUmFuZ2VGb3JCdWZmZXJSYW5nZShyYW5nZSksXG4gICAgICAgIHsgY2VudGVyOiBmYWxzZSB9LFxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBvcGVuTmV3V2luZG93KCkge1xuICAgIE1hcmtkb3duUHJldmlld1ZpZXdFZGl0b3JSZW1vdGUub3Blbih0aGlzLmVkaXRvcilcbiAgICB1dGlsLmRlc3Ryb3kodGhpcylcbiAgfVxuXG4gIHByb3RlY3RlZCBvcGVuU291cmNlKGluaXRpYWxMaW5lPzogbnVtYmVyKSB7XG4gICAgaWYgKGluaXRpYWxMaW5lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFtpbml0aWFsTGluZSwgMF0pXG4gICAgfVxuICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzLmVkaXRvcilcbiAgICBpZiAoIXBhbmUpIHJldHVyblxuICAgIHBhbmUuYWN0aXZhdGVJdGVtKHRoaXMuZWRpdG9yKVxuICAgIHBhbmUuYWN0aXZhdGUoKVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVFZGl0b3JFdmVudHMoKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVRleHRFZGl0b3IoKGVkKSA9PiB7XG4gICAgICAgIGlmIChhdG9tQ29uZmlnKCkucHJldmlld0NvbmZpZy5hY3RpdmF0ZVByZXZpZXdXaXRoRWRpdG9yKSB7XG4gICAgICAgICAgaWYgKGVkID09PSB0aGlzLmVkaXRvcikge1xuICAgICAgICAgICAgY29uc3QgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKHRoaXMpXG4gICAgICAgICAgICBpZiAoIXBhbmUpIHJldHVyblxuICAgICAgICAgICAgY29uc3QgZWRQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oZWQpXG4gICAgICAgICAgICBpZiAocGFuZSA9PT0gZWRQYW5lKSByZXR1cm5cbiAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKHRoaXMpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU3RvcENoYW5naW5nKCgpID0+IHtcbiAgICAgICAgaWYgKGF0b21Db25maWcoKS5wcmV2aWV3Q29uZmlnLmxpdmVVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoYW5nZUhhbmRsZXIoKVxuICAgICAgICB9XG4gICAgICAgIGlmIChhdG9tQ29uZmlnKCkuc3luY0NvbmZpZy5zeW5jUHJldmlld09uQ2hhbmdlKSB7XG4gICAgICAgICAgaGFuZGxlUHJvbWlzZSh0aGlzLnN5bmNQcmV2aWV3SGVscGVyKCkpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5lZGl0b3Iub25EaWRDaGFuZ2VQYXRoKCgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtdGl0bGUnKVxuICAgICAgfSksXG4gICAgICB0aGlzLmVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICBpZiAoYXRvbUNvbmZpZygpLnByZXZpZXdDb25maWcuY2xvc2VQcmV2aWV3V2l0aEVkaXRvcikge1xuICAgICAgICAgIHV0aWwuZGVzdHJveSh0aGlzKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoKSA9PiB7XG4gICAgICAgIGlmICghYXRvbUNvbmZpZygpLnByZXZpZXdDb25maWcubGl2ZVVwZGF0ZSkge1xuICAgICAgICAgIHRoaXMuY2hhbmdlSGFuZGxlcigpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRSZWxvYWQoKCkgPT4ge1xuICAgICAgICBpZiAoIWF0b21Db25maWcoKS5wcmV2aWV3Q29uZmlnLmxpdmVVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLmNoYW5nZUhhbmRsZXIoKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLmVkaXRvcikub25EaWRDaGFuZ2VTY3JvbGxUb3AoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkU2Nyb2xsU3luYygnZWRpdG9yJykpIHJldHVyblxuICAgICAgICBjb25zdCBbZmlyc3QsIGxhc3RdID0gdGhpcy5lZGl0b3IuZ2V0VmlzaWJsZVJvd1JhbmdlKClcbiAgICAgICAgdGhpcy5oYW5kbGVyLnNjcm9sbFN5bmMoXG4gICAgICAgICAgdGhpcy5lZGl0b3IuYnVmZmVyUm93Rm9yU2NyZWVuUm93KGZpcnN0KSxcbiAgICAgICAgICB0aGlzLmVkaXRvci5idWZmZXJSb3dGb3JTY3JlZW5Sb3cobGFzdCksXG4gICAgICAgIClcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMuZWRpdG9yKSwge1xuICAgICAgICAnbWFya2Rvd24tcHJldmlldy1wbHVzOnN5bmMtcHJldmlldyc6IHRoaXMuc3luY1ByZXZpZXdIZWxwZXIsXG4gICAgICB9KSxcbiAgICApXG4gIH1cblxuICBwcml2YXRlIHN5bmNQcmV2aWV3SGVscGVyID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93XG4gICAgdGhpcy5zeW5jUHJldmlldyhwb3MpXG4gIH1cblxuICBwcml2YXRlIHNob3VsZFNjcm9sbFN5bmMod2hhdFNjcm9sbGVkOiAnZWRpdG9yJyB8ICdwcmV2aWV3Jykge1xuICAgIGNvbnN0IGNvbmZpZyA9IGF0b21Db25maWcoKS5zeW5jQ29uZmlnXG4gICAgaWYgKGNvbmZpZy5zeW5jRWRpdG9yT25QcmV2aWV3U2Nyb2xsICYmIGNvbmZpZy5zeW5jUHJldmlld09uRWRpdG9yU2Nyb2xsKSB7XG4gICAgICBjb25zdCBpdGVtID0gd2hhdFNjcm9sbGVkID09PSAnZWRpdG9yJyA/IHRoaXMuZWRpdG9yIDogdGhpc1xuICAgICAgY29uc3QgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGl0ZW0pXG4gICAgICByZXR1cm4gcGFuZSAmJiBwYW5lLmlzQWN0aXZlKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgKGNvbmZpZy5zeW5jRWRpdG9yT25QcmV2aWV3U2Nyb2xsICYmIHdoYXRTY3JvbGxlZCA9PT0gJ3ByZXZpZXcnKSB8fFxuICAgICAgICAoY29uZmlnLnN5bmNQcmV2aWV3T25FZGl0b3JTY3JvbGwgJiYgd2hhdFNjcm9sbGVkID09PSAnZWRpdG9yJylcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cbiJdfQ==