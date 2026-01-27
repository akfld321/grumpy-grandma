
import os

target_file = r"C:\Users\love2\.gemini\antigravity\scratch\grumpy-grandma\components\chat\WebtoonResultFixed.tsx"

new_content = """                            {/* FULL BACKGROUND IMAGE - Fills the whole 650px */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/grandma_smoking_v2.png"
                                    alt="Grandma Warning"
                                    fill
                                    className="object-cover object-top opacity-90 transition-transform duration-1000 group-hover:scale-105"
                                />
                                {/* Bottom Gradient for Text Readability */}
                                <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                            </div>

                            {/* SPEECH BUBBLE - Positioned at top */}
                            <div className="absolute top-[50px] left-1/2 -translate-x-1/2 w-[90%] max-w-[340px] z-30">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    className="bg-black/90 border-4 border-white p-6 shadow-2xl relative rounded-3xl backdrop-blur-sm"
                                >
                                    <h2 className="text-2xl font-aggro text-red-500 mb-3 animate-pulse text-center leading-tight">
                                        "이거 안 보면 너만 손해야!"
                                    </h2>
                                    <p className="text-sm text-white leading-relaxed font-bold text-center break-keep">
                                        올해가 진짜 중요한데... 여기서 멈추면 내년엔 손가락만 빨고 있을 게 뻔해.<br/><br/>
                                        <span className="text-yellow-400 border-b border-yellow-400">너는 운이 들어올 때 피해야 할 '이것'이 있어.</span>
                                    </p>
                                    {/* Bubble Tail */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-black/90 border-b-4 border-r-4 border-white rotate-45 transform"></div>
                                </motion.div>
                            </div>

                            {/* Sound Effect - Moved to Bottom Right near pipe */}
                            <div className="absolute bottom-[100px] right-4 text-5xl font-black text-white rotate-[-10deg] drop-shadow-[2px_2px_0px_#red] z-20 font-aggro opacity-80 animate-pulse pointer-events-none select-none">
                                후우...
                            </div>

                            {/* Narrator Text - Bottom */}
                            <div className="absolute bottom-6 left-0 w-full text-center z-20">
                                <p className="font-bold text-xs text-stone-300 drop-shadow-md bg-black/40 inline-block px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                                    ※ 할머니가 정리한 비책은 유료본에만 있습니다.
                                </p>
                            </div>"""

with open(target_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find the start and end points
start_idx = -1
end_idx = -1

# We are looking for the content AFTER "EP.02 마지막 경고" which is inside a div
# The container div starts at line 565 (approx)
# We want to replace lines 571 to 612 (approx)
# Line 571 starts with {/* SECTION 1: DIALOGUE AREA
# Line 612 ends with </div> of SECTION 2

for i, line in enumerate(lines):
    if "{/* SECTION 1: DIALOGUE AREA" in line:
        start_idx = i
    if "{/* 8. DISCOUNT SHARE */}" in line: # This is the next section
        end_idx = i
        break

# Refine end_idx: iterate backwards from 8. DISCOUNT SHARE to find the closing div of the CONTAINER
# The container closes at line 613 (approx)
# We want to replace up to the line *before* the container's closing div.
# Actually, let's just find the start of Section 1 and Replace until we see the closing div of the container?
# Container starts at line 565 with class "bg-black..."

# Better strategy:
# Find the line index of "EP.02 마지막 경고" (Line 568)
# The div closing that header is line 569.
# The content starts at line 571.
# The content ends before the closing div of the "group" container.

header_idx = -1
container_close_idx = -1

for i, line in enumerate(lines):
    if "EP.02 마지막 경고" in line:
        header_idx = i

if header_idx != -1:
    # Scan forward to find the next meaningful block
    # Start replacing after the closing div of "header"
    start_replace_idx = header_idx + 2 # Skip the line with string and the </div>
    
    # Check if start_replace_idx is correct
    print(f"Start content: {lines[start_replace_idx]}") # Should be Section 1 comment
    
    # Find the closing div of the container. 
    # It corresponds to indentation of line 565.
    # We can scan for the next lines until we hit the line with correct indentation or the next section.
    
    # Let's search for "/* 8. DISCOUNT SHARE */"
    for j in range(start_replace_idx, len(lines)):
        if "{/* 8. DISCOUNT SHARE */}" in lines[j]:
            # Backtrack to find the closing </section>, closing </div> (wrapper), closing </div> (container)
            # 618: section
            # 615: </section>
            # 614: </div> wrapper
            # 613: </div> container
            
            # So we want to replace up to j - 5 ?? No strictly.
            # Let's verify by printing.
            container_close_idx = j
            while "</div>" not in lines[container_close_idx]:
                container_close_idx -= 1
            # Found one </div>. Scan back more.
            # We want the closing of the container div.
            # It should align with line 565 indentation (24 spaces).
            
            # But relying on indentation is risky if spaces/tabs mixed.
            # Let's just hardcode: stop at the line containing "{/* 8. DISCOUNT SHARE */}" minus some lines.
            
            # Actually, simpler: just find the range based on strings.
            # Start: "{/* SECTION 1: DIALOGUE AREA"
            # End: line containing "※ 할머니가 정리한 비책은 유료본에만 있습니다." plus closing divs?
            # No, the old code ends with "※ 할머니..."
            
            # Find start: "{/* SECTION 1: DIALOGUE AREA"
            for k in range(header_idx, len(lines)):
                 if "{/* SECTION 1: DIALOGUE AREA" in lines[k]:
                     start_replace_idx = k
                     break
            
            # Find end: The closing </div> of Section 2.
            # Section 2 starts with "{/* SECTION 2: IMAGE AREA"
            # It ends before the closing </div> of the container.
            
            # Let's use the line "{/* 8. DISCOUNT SHARE */}" as anchor.
            # The line BEFORE that is usually empty.
            # The line BEFORE that is </section>
            # The line BEFORE that is </div> (wrapper)
            # The line BEFORE that is </div> (container)
            
            # So lines[j-4] should be the closing div of the container.
            # We want to replace everything from start_replace_idx up to j-4.
            
            # Let's scan backwards from "8. DISCOUNT SHARE" (line 617-618)
            # 615: </section>
            # 614: </div>
            # 613: </div>  <- This is the container close.
            # We want to insert *before* line 613.
            
            end_replace_idx = j - 1
            while "</section>" not in lines[end_replace_idx]:
                end_replace_idx -= 1
            # Now at </section>
            end_replace_idx -= 1
            while "</div>" not in lines[end_replace_idx]: # wrapper
                end_replace_idx -= 1
            end_replace_idx -= 1
            while "</div>" not in lines[end_replace_idx]: # container
                end_replace_idx -= 1
            
            # Now end_replace_idx points to the closing </div> of the container.
            # We want to replace UP TO that line (exclusive).
            break

    if start_replace_idx != -1 and end_replace_idx != -1:
        print(f"Replacing lines {start_replace_idx+1} to {end_replace_idx}")
        print(f"First line to go: {lines[start_replace_idx]}")
        print(f"Last line to go (prev): {lines[end_replace_idx-1]}")
        print(f"Stop line (kept): {lines[end_replace_idx]}")
        
        # Replace
        lines[start_replace_idx:end_replace_idx] = [new_content + "\n"]
        
        with open(target_file, "w", encoding="utf-8") as f_out:
            f_out.writelines(lines)
        print("Successfully replaced content.")
    else:
        print("Could not find start/end markers.")
else:
    print("Could not find 'EP.02 마지막 경고'")
