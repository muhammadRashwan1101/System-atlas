import CytoscapeComponent from "react-cytoscapejs";
import { useRef, useEffect } from 'react';

const elements = [
  { data: { id: "lb", label: "Load Balancer"}, position: { x: 0, y: 160 } },
  { data: { id: "apig1", label: "API-V1" }, position: { x: 200, y: 90 } },
  { data: { id: "apig2", label: "API-V2" }, position: { x: 200, y: 240 } },
  { data: { id: "auth", label: "Auth Services" }, position: { x: 500, y: 20 } },
  { data: { id: "cart", label: "Cart-Svc" }, position: { x: 500, y: 100 } },
  { data: { id: "bill", label: "Billing-Svc" }, position: { x: 500, y: 220 } },
  { data: { id: "catalog", label: "Catalog-Svc" }, position: { x: 500, y: 300 } },
  { data: { id: "DB", label: "MongoDB" }, position: { x: 800, y: 230 } },
  { data: { id: "Red", label: "Redis Cluster" }, position: { x: 800, y: 80 } },
  { data: { id: "lb-apig1", source: "lb", target: "apig1" } },
  { data: { id: "lb-apig2", source: "lb", target: "apig2" } },
  { data: { id: "apig1-auth", source: "apig1", target: "auth" } },
  { data: { id: "apig1-cart", source: "apig1", target: "cart" } },
  { data: { id: "apig2-bill", source: "apig2", target: "bill" } },
  { data: { id: "apig2-catalog", source: "apig2", target: "catalog" } },
  { data: { id: "auth-red", source: "auth", target: "Red" } },
  { data: { id: "cart-red", source: "cart", target: "Red" } },
  { data: { id: "bill-db", source: "bill", target: "DB" } },
  { data: { id: "catalog-db", source: "catalog", target: "DB" } },
];

export default function HeroGraph() {
    const cyRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.center()

        let offset = 0;
        animRef.current = setInterval(() => {
        offset = (offset - 1 + 100) % 100;
        cy.edges().style({ 'line-dash-offset': offset });
        }, 40);

        return () => clearInterval(animRef.current);
    }, []);

  return (
    <div className="flex items-center justify-center  text-white text-center gap-15 mx-auto max-w-[60%] py-20 px-5">
      <CytoscapeComponent
        elements={elements}
        className="flex items-center justify-center w-[99.5%] h-140 rounded-xl bg-[linear-gradient(0deg,#000000,#00000020,#09090B70)] backdrop-blur border border-[#202020a4] shadow-xl/70"
        stylesheet={[
          {
            selector: "node",
            style: {
                "label": "data(label)",
                "background-color": "#121315",
                "width": "128px",
                "height": "40px",
                'content': 'data(label)',
                'color': 'gray', 
                'font-size': '12px',
                'font-family': "JetBrains Mono",
                'shape': 'round-rectangle',
                'border-width': '0.2px',
                'border-color': '#FFFFFF',
                "padding": "10px",
                "text-valign": "center",
                "text-halign": "center",
            },
          },
          {
            selector: "node[id='lb'], node[id='auth'], node[id='catalog']",
            style: {    
                "border-color": "#ADC6FF",
                "border-width": "1px",
                "color": "#ADC6FF",
            }
        },
        {
            selector: "edge",
            style: {
                "line-style": "dashed",
                "line-dash-pattern": [6, 4],
                "line-dash-offset": 0,
                "opacity": 0.3,
                "curve-style": "bezier",
                width: 2,
            },
        },
        {
            selector: "edge[id='lb-apig1'], edge[id='lb-apig2'], edge[id='apig2-catalog'] ,edge[id='apig1-auth'], edge[id='auth-red'], edge[id='catalog-db']",
            style: {
                "line-color": "#ADC6FF",
                "line-style": "dashed",
                "line-dash-pattern": [6, 4],
                "line-dash-offset": 0,
                "opacity": 0.5,
                "curve-style": "bezier",
              width: 2,
            },
          },
        {
            selector: "node[id='DB'], node[id='Red']",
            style: {    
              "border-color": "#4EDEA3",
              "border-width": "1px",
              "color": "#4EDEA3",
            }
          },
        ]}
        cy={(cy) => { cyRef.current = cy; }}
      />
    </div>
  );
}
