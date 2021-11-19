import React from "react";
import { jsPDF,HTMLOptionImage } from "jspdf";
import { toPng,toCanvas } from "html-to-image";
import { Feedback } from "@prisma/client";
type props = {

  html?: React.MutableRefObject<HTMLDivElement>;

};

const GeneratePdf: React.FC<props> = ({ html }) => {
  const generatePdf = () => {
      const doc = new jsPDF();

      const feedback : Feedback = {
          id : 1,
          authorId: '1',
          tags : [],
          title : "Peer review",
          description : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam animi,molestiae quaerat assumenda neque culpa ab aliquam facilis eos nesciunt! Voluptatibus eligendi vero amet dolorem omnis provident beatae nihil earum! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, est. Magni animi fugit voluptates mollitia officia libero in. Voluptatibus nisi assumenda accusamus deserunt sunt quidem in, ab perspiciatis ad rem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil accusantium reprehenderit, quasi dolorum deserunt, nisi dolores quae officiis odio vel natus! Pariatur enim culpa velit consequatur sapiente natus dicta alias! Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, asperiores error laudantium corporis sunt earum incidunt expedita quo quidem delectus fugiat facilis quia impedit sit magni quibusdam ipsam reiciendis quaerat!\n"

      };

      var lengthText = "Feedback".length;

      var fontSize = 30;
      doc.setFontSize(fontSize);

      var xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth("Feedback") * fontSize/4) + 5;
      doc.text("Feedback", xOffset, fontSize);

      doc.setFontSize(30)
      doc.text(feedback.title,10,55)
      doc.setFontSize(12)
      doc.text(formatText(feedback.description),10,63)
      //doc.text(formatText("Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam animi,molestiae quaerat assumenda neque culpa ab aliquam facilis eos nesciunt! Voluptatibus eligendi vero amet dolorem omnis provident beatae nihil earum! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, est. Magni animi fugit voluptates mollitia officia libero in. Voluptatibus nisi assumenda accusamus deserunt sunt quidem in, ab perspiciatis ad rem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil accusantium reprehenderit, quasi dolorum deserunt, nisi dolores quae officiis odio vel natus! Pariatur enim culpa velit consequatur sapiente natus dicta alias! Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, asperiores error laudantium corporis sunt earum incidunt expedita quo quidem delectus fugiat facilis quia impedit sit magni quibusdam ipsam reiciendis quaerat!\n" +
        //  "\n"),10,63)

      doc.output("dataurlnewwindow");
  };

  function formatText(text:String){
      var result:String = ""

      for (let i = 0; i < text.length; i++) {
          if(i % 90 == 0){
              result = result + "\n";
              result = result + text.charAt(i);
          }else{
              result = result + text.charAt(i);
          }
      }
      return result
  }




  const generateImage=async ()=>{
    const image = await toPng(html.current,{quality:0.95});
    const doc = new jsPDF();

      doc.addImage(image,'JPEG',5,22,200,160);
      doc.save();


  }
  return (

    <div className="button-container">
        <button onClick={generateImage}>
        Get PDF using image
      </button>
      <button onClick={generatePdf}>
        Get PDF as text
      </button>
    </div>

  );
};

export default GeneratePdf;