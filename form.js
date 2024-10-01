/**
  * An example of a custom submit button extending the native HTMLElement. 
  * When clicked it will find and run the submit method on the closest 
  * parent c-form element.
  */
export class AcmeSubmitButton extends HTMLElement {
    constructor() {
      super();
  
      const shadowRoot = this.attachShadow({ mode: 'open' });
  
      const button = document.createElement('button');
      shadowRoot.appendChild(button);
  
      const slot = document.createElement('slot');
      button.appendChild(slot);
  
      const style = document.createElement('style');
      style.innerText = `
        button {
          apperance: none;
          border: none;
          background: green;
          color: #fff;
          border-radius: 0.5em;
          font-size: 2rem;
          padding: 0.5em 1em;
        }
      `;
      shadowRoot.appendChild(style);
     /** https://stackoverflow.com/a/71666543 */
     function querySelector(selector) {
       return querySelectorAll(document, selector)[0];
     }
     
     function querySelectorAll(node, selector) {
       const nodes = [...node.querySelectorAll(selector)];
       const nodeIterator = document.createNodeIterator(
         node,
         NodeFilter.SHOW_ELEMENT,
         node => node instanceof Element && node.shadowRoot
           ? NodeFilter.FILTER_ACCEPT
           : NodeFilter.FILTER_REJECT,
       );
     
       let currentNode = nodeIterator.nextNode();
       while (currentNode) {
         nodes.push(...querySelectorAll(currentNode.shadowRoot, selector));
         currentNode = nodeIterator.nextNode();
       }
     
       return nodes;
      }


     
      button.addEventListener('click', () => {
          var _gleasonScoreRoot = querySelector("c-input-count[name='T0_total_gleason_score']");
          console.log(_gleasonScoreRoot);
          console.log(gleasonScoreRoot);
      });
     
      setTimeout(() => {
      var gleasonScoreRoot = querySelector("c-input-count[name='T0_total_gleason_score']");
      
        button.innerHTML = "value: ";
        gleasonScoreRoot?.addEventListener('input', function(event) {
           button.innerHTML = "value: " + event.target.value;
           console.log('Input value changed to:', event.target.value);
       });
      });
    }
  }
  
  customElements.define('acme-submit-button', AcmeSubmitButton);
