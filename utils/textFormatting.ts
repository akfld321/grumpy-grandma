/**
 * Formats text to have double line breaks after specific punctuation marks.
 * Rule: Replace [.!?] followed by whitespace with the punctuation + \n\n
 */
export const formatWithSentenceBreaks = (text: string | undefined | null): string => {
    if (!text) return '';
    // Replace period, question mark, exclamation mark followed by one or more spaces with the punctuation and two newlines
    return text.replace(/([.!?])\s+/g, '$1\n\n');
};
