"use client";

import { useEffect } from "react";
import "./animated-cursor.css";

export default function AnimatedCursor() {
    const foods = ["🥦", "🥕", "🍎", "🍌", "🍇", "🍓", "🥑", "🥒", "🥬", "🍊", "🍍"];

    useEffect(() => {
        let lastSpawn = 0;

        const onMove = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastSpawn > 300) {
                lastSpawn = now;

                const food = document.createElement("div");
                food.className = "cursor-trail";
                food.innerText = foods[Math.floor(Math.random() * foods.length)];
                food.style.left = `${e.clientX}px`;
                food.style.top = `${e.clientY}px`;
                document.body.appendChild(food);

                setTimeout(() => food.remove(), 2200);
            }
        };

        document.addEventListener("mousemove", onMove);
        return () => {
            document.removeEventListener("mousemove", onMove);
        };
    }, []);

    return null;
}
