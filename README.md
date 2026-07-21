mumu-blox/
├── app/
│   ├── globals.css                
│   ├── layout.tsx                 
│   ├── page.tsx                  
│   │
│   ├── teacher/                   
│   │   ├── dashboard/page.tsx     
│   │   └── editor/[mapId]/page.tsx
│   │
│   └── student/                   
│       └── [placeId]/
│           ├── page.tsx           
│           └── play/page.tsx      
│
├── components/                    
│   ├── editor/
│   │   └── MapEditor.tsx          
│   ├── game/
│   │   ├── GameCanvas.tsx        
│   │   └── Player.tsx             
│   └── ui/
│       └── SharedUI.tsx           
├── lib/                           
│   ├── supabase.ts                
│   └── store.ts                   
├── public/                        
├── tailwind.config.ts             
└── package.json