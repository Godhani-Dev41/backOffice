import { Injectable } from "@angular/core";

declare var tinymce: any;
@Injectable()
export class TinymceService {
  InitiateTiny(): void {
    return tinymce.init({
      selector: "textarea.desceditor",
      toolbar: "bold italic underline | alignleft aligncenter " + "alignright | bullist numlist link | ",
      menubar: false,
      statusbar: false,
      link_title: false,
      plugins: ["advlist autolink lists link ", " paste "],
      max: 10000,
      setup: (editor) => {
        //   this.editor = editor;
        editor.on("init", (e) => {
          // editor.setContent(this.eventForm.get("description").value);
        });
      },
      // init_instance_callback: (editor) => this.handleValueChanged(editor),
    });
  }
}
