"use strict";
const specialChars = ['-', '+', '~', '=', '>'];
function isOpening(str, pos) {
    if (str[pos] === '{' &&
        specialChars.includes(str[pos + 1]) &&
        str[pos + 2] === str[pos + 1]) {
        const op = str.slice(pos + 1, pos + 3);
        const cl = op[0] === '>' ? '<<}' : op + '}';
        return [op, cl];
    }
    else {
        return null;
    }
}
function criticInline(state, silent) {
    const { src, pos } = state;
    const tags = isOpening(src, pos);
    if (tags === null)
        return false;
    const [opening, closing] = tags;
    const endPos = src.indexOf(closing, pos + 3);
    const content = endPos >= 0 ? src.slice(pos + 3, endPos) : null;
    if (content === null)
        return false;
    if (silent)
        return true;
    const token = state.push('critic-markup');
    token.content = content;
    token.tag = opening;
    state.pos = endPos + closing.length;
    return true;
}
function criticRender(tokens, idx) {
    const token = tokens[idx];
    const tag = token.tag;
    const content = token.content;
    if (tag === '--') {
        return `<del>${content}</del>`;
    }
    else if (tag === '++') {
        return `<ins>${content}</ins>`;
    }
    else if (tag === '==') {
        return `<mark>${content}</mark>`;
    }
    else if (tag === '>>') {
        return `<span tabindex="-1" class="critic comment"><span>${content}</span></span>`;
    }
    else {
        const arr = content.split('~>');
        if (arr.length === 2) {
            return `<del>${arr[0]}</del><ins>${arr[1]}</ins>`;
        }
        else {
            return `<code>Error: ~> not found.</code>`;
        }
    }
}
module.exports = function (md) {
    md.inline.ruler.before('strikethrough', 'critic-markup', criticInline);
    md.renderer.rules['critic-markup'] = criticRender;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWFya2Rvd24taXQtY3JpdGljbWFya3VwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFrQkEsTUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFFOUMsbUJBQW1CLEdBQVcsRUFBRSxHQUFXO0lBQ3pDLElBQ0UsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUc7UUFDaEIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFDN0I7UUFDQSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3RDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUMzQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0tBQ2hCO1NBQU07UUFDTCxPQUFPLElBQUksQ0FBQTtLQUNaO0FBQ0gsQ0FBQztBQUVELHNCQUNFLEtBQXdFLEVBQ3hFLE1BQWU7SUFFZixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQTtJQUMxQixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQ2hDLElBQUksSUFBSSxLQUFLLElBQUk7UUFBRSxPQUFPLEtBQUssQ0FBQTtJQUMvQixNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQTtJQUMvQixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDNUMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7SUFDL0QsSUFBSSxPQUFPLEtBQUssSUFBSTtRQUFFLE9BQU8sS0FBSyxDQUFBO0lBQ2xDLElBQUksTUFBTTtRQUFFLE9BQU8sSUFBSSxDQUFBO0lBQ3ZCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7SUFDekMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7SUFDdkIsS0FBSyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUE7SUFDbkIsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQTtJQUNuQyxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUM7QUFFRCxzQkFBc0IsTUFBb0IsRUFBRSxHQUFXO0lBQ3JELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN6QixNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFBO0lBQ3JCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUE7SUFDN0IsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ2hCLE9BQU8sUUFBUSxPQUFPLFFBQVEsQ0FBQTtLQUMvQjtTQUFNLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtRQUN2QixPQUFPLFFBQVEsT0FBTyxRQUFRLENBQUE7S0FDL0I7U0FBTSxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDdkIsT0FBTyxTQUFTLE9BQU8sU0FBUyxDQUFBO0tBQ2pDO1NBQU0sSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ3ZCLE9BQU8sb0RBQW9ELE9BQU8sZ0JBQWdCLENBQUE7S0FDbkY7U0FBTTtRQUVMLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDL0IsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwQixPQUFPLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFBO1NBQ2xEO2FBQU07WUFDTCxPQUFPLG1DQUFtQyxDQUFBO1NBQzNDO0tBQ0Y7QUFDSCxDQUFDO0FBRUQsaUJBQVMsVUFBUyxFQUFtQjtJQUNuQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxZQUFtQixDQUFDLENBQUE7SUFDN0UsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsWUFBWSxDQUFBO0FBQ25ELENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgZmlsZSBpbmNvcnBvcmF0ZXMgY29kZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS93YWZlci1saS9tYXJrZG93bi1pdC1jcml0aWNtYXJrdXBcbi8vIGNvdmVyZWQgYnkgdGhlIGZvbGxvd2luZyB0ZXJtczpcbi8vIENvcHlyaWdodCAyMDE3IFdhZmVyIExpXG4vL1xuLy8gUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XG4vLyBwdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQsIHByb3ZpZGVkIHRoYXQgdGhlIGFib3ZlXG4vLyBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIGFwcGVhciBpbiBhbGwgY29waWVzLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTXG4vLyBXSVRIIFJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTllcbi8vIFNQRUNJQUwsIERJUkVDVCwgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFU1xuLy8gV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTSBMT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuLy8gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1IgT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTlxuLy8gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1IgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cblxuaW1wb3J0ICogYXMgbWRJdCBmcm9tICdtYXJrZG93bi1pdCdcblxuY29uc3Qgc3BlY2lhbENoYXJzID0gWyctJywgJysnLCAnficsICc9JywgJz4nXVxuXG5mdW5jdGlvbiBpc09wZW5pbmcoc3RyOiBzdHJpbmcsIHBvczogbnVtYmVyKTogW3N0cmluZywgc3RyaW5nXSB8IG51bGwge1xuICBpZiAoXG4gICAgc3RyW3Bvc10gPT09ICd7JyAmJlxuICAgIHNwZWNpYWxDaGFycy5pbmNsdWRlcyhzdHJbcG9zICsgMV0pICYmXG4gICAgc3RyW3BvcyArIDJdID09PSBzdHJbcG9zICsgMV1cbiAgKSB7XG4gICAgY29uc3Qgb3AgPSBzdHIuc2xpY2UocG9zICsgMSwgcG9zICsgMylcbiAgICBjb25zdCBjbCA9IG9wWzBdID09PSAnPicgPyAnPDx9JyA6IG9wICsgJ30nXG4gICAgcmV0dXJuIFtvcCwgY2xdXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5mdW5jdGlvbiBjcml0aWNJbmxpbmUoXG4gIHN0YXRlOiB7IHNyYzogc3RyaW5nOyBwb3M6IG51bWJlcjsgcHVzaDogKHRva2VuOiBzdHJpbmcpID0+IG1kSXQuVG9rZW4gfSxcbiAgc2lsZW50OiBib29sZWFuLFxuKSB7XG4gIGNvbnN0IHsgc3JjLCBwb3MgfSA9IHN0YXRlXG4gIGNvbnN0IHRhZ3MgPSBpc09wZW5pbmcoc3JjLCBwb3MpXG4gIGlmICh0YWdzID09PSBudWxsKSByZXR1cm4gZmFsc2VcbiAgY29uc3QgW29wZW5pbmcsIGNsb3NpbmddID0gdGFnc1xuICBjb25zdCBlbmRQb3MgPSBzcmMuaW5kZXhPZihjbG9zaW5nLCBwb3MgKyAzKVxuICBjb25zdCBjb250ZW50ID0gZW5kUG9zID49IDAgPyBzcmMuc2xpY2UocG9zICsgMywgZW5kUG9zKSA6IG51bGxcbiAgaWYgKGNvbnRlbnQgPT09IG51bGwpIHJldHVybiBmYWxzZVxuICBpZiAoc2lsZW50KSByZXR1cm4gdHJ1ZVxuICBjb25zdCB0b2tlbiA9IHN0YXRlLnB1c2goJ2NyaXRpYy1tYXJrdXAnKVxuICB0b2tlbi5jb250ZW50ID0gY29udGVudFxuICB0b2tlbi50YWcgPSBvcGVuaW5nXG4gIHN0YXRlLnBvcyA9IGVuZFBvcyArIGNsb3NpbmcubGVuZ3RoXG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGNyaXRpY1JlbmRlcih0b2tlbnM6IG1kSXQuVG9rZW5bXSwgaWR4OiBudW1iZXIpIHtcbiAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XVxuICBjb25zdCB0YWcgPSB0b2tlbi50YWdcbiAgY29uc3QgY29udGVudCA9IHRva2VuLmNvbnRlbnRcbiAgaWYgKHRhZyA9PT0gJy0tJykge1xuICAgIHJldHVybiBgPGRlbD4ke2NvbnRlbnR9PC9kZWw+YFxuICB9IGVsc2UgaWYgKHRhZyA9PT0gJysrJykge1xuICAgIHJldHVybiBgPGlucz4ke2NvbnRlbnR9PC9pbnM+YFxuICB9IGVsc2UgaWYgKHRhZyA9PT0gJz09Jykge1xuICAgIHJldHVybiBgPG1hcms+JHtjb250ZW50fTwvbWFyaz5gXG4gIH0gZWxzZSBpZiAodGFnID09PSAnPj4nKSB7XG4gICAgcmV0dXJuIGA8c3BhbiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCJjcml0aWMgY29tbWVudFwiPjxzcGFuPiR7Y29udGVudH08L3NwYW4+PC9zcGFuPmBcbiAgfSBlbHNlIHtcbiAgICAvLyB7fn5bdGV4dDFdfj5bdGV4dDJdfn59XG4gICAgY29uc3QgYXJyID0gY29udGVudC5zcGxpdCgnfj4nKVxuICAgIGlmIChhcnIubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gYDxkZWw+JHthcnJbMF19PC9kZWw+PGlucz4ke2FyclsxXX08L2lucz5gXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgPGNvZGU+RXJyb3I6IH4+IG5vdCBmb3VuZC48L2NvZGU+YFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgPSBmdW5jdGlvbihtZDogbWRJdC5NYXJrZG93bkl0KSB7XG4gIG1kLmlubGluZS5ydWxlci5iZWZvcmUoJ3N0cmlrZXRocm91Z2gnLCAnY3JpdGljLW1hcmt1cCcsIGNyaXRpY0lubGluZSBhcyBhbnkpXG4gIG1kLnJlbmRlcmVyLnJ1bGVzWydjcml0aWMtbWFya3VwJ10gPSBjcml0aWNSZW5kZXJcbn1cbiJdfQ==