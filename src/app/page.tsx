'use client'

import styles from './page.module.css'
import { useRete } from "rete-react-plugin";
import { createEditor } from "@/app/editor";

export default function Home() {
  const [ref] = useRete(createEditor);

  return (
    <main>
      <div ref={ref} className={styles.editor}/>
    </main>
  )
}
