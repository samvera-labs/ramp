import { addHighlightTags, getMatchedTranscriptLines, parseContentSearchResponse } from './search-parser';

describe('search-parser', () => {
  describe('getMatchedTranscriptLines()', () => {
    const transcripts = [
      {
        id: 0, begin: 71.9, end: 82, tag: "TIMED_CUE",
        text: 'Then, in the lunchroom, Mr. Bungle was so <br >clumsy and impolite that he knocked over <br >everything. And no one wanted to sit next <br >to him.'
      },
      {
        id: 1, begin: 83.5, end: 89, tag: "TIMED_CUE",
        text: 'And when he finally knocked his own tray <br >off the table, that was the end of the puppet <br >show.'
      },
      {
        id: 2, begin: 90.3, end: 96.3, tag: "TIMED_CUE",
        text: 'The children knew that even though Mr. Bungle <br >was funny to watch, he wouldn\'t be much fun <br >to eat with.'
      },
      {
        id: 3, begin: 96.4, end: 102.5, tag: "TIMED_CUE",
        text: 'Phil knew that a Mr. Bungle wouldn\'t have <br >many friends. He wouldn\'t want to be like <br >Mr. Bungle.'
      },
      {
        id: 4, begin: 103.9, end: 109.1, tag: "TIMED_CUE",
        text: 'Later Miss Brown said it was time to for <br >the children who ate in the cafeteria to <br >go to lunch.'
      },
      {
        id: 5, begin: 109.2, end: 112.5, tag: "TIMED_CUE",
        text: 'She hoped there weren\'t any Mr. Bungles in <br >this room.'
      },
      {
        id: 6, begin: 118.5, end: 123.2, tag: "TIMED_CUE",
        text: 'Phil stopped to return a book to Miss Brown <br >while his friends went on to the lunchroom.'
      },
    ];

    test('with a single match in a cue', () => {
      const searchHits = [
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:36.400,00:01:42.500",
          targetURI: "http://example.com/canvas/1/transcript/1/transcripts",
          hitCount: 1,
          value: "<em>Phil</em> knew that a Mr. Bungle wouldn't have many friends. He wouldn't want to be like Mr. Bungle."
        },
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:58.500,00:02:03.200",
          targetURI: "http://example.com/canvas/1/transcrip/1/transcripts",
          hitCount: 1,
          value: "Phil stopped to return a book to Miss Brown while his friends went on to the lunchroom."
        },
      ];
      const matchedTranscriptLines = getMatchedTranscriptLines(searchHits, 'phil', transcripts);
      expect(matchedTranscriptLines).toHaveLength(2);
      expect(matchedTranscriptLines[0]).toEqual({
        id: 3,
        begin: 96.4,
        end: 102.5,
        tag: "TIMED_CUE",
        text: "Phil knew that a Mr. Bungle wouldn't have <br >many friends. He wouldn't want to be like <br >Mr. Bungle.",
        match: "<span class=\"ramp--transcript_highlight\">Phil</span> knew that a Mr. Bungle wouldn't have <br>many friends. He wouldn't want to be like <br>Mr. Bungle.",
        matchCount: 1,
      });
    });

    test('with multiple matches in a cue', () => {
      const searchHits = [
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:11.900,00:01:22.000",
          targetURI: "http://example.com/canvas/1/transcript/1/transcripts",
          hitCount: 1,
          value: "Then, in the lunchroom, Mr. <em>Bungle</em> was so clumsy and impolite that he knocked over everything. And no one wanted to sit next to him."
        },
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:30.300,00:01:36.300",
          targetURI: "http://example.com/canvas/1/transcrip/1/transcripts",
          hitCount: 1,
          value: "The children knew that even though Mr. <em>Bungle</em> was funny to watch, he wouldn\'t be much fun to eat with."
        },
        {
          target: "http://example.com/canvas/1/transcript/1/transcripts#t=00:01:36.400,00:01:42.500",
          targetURI: "http://example.com/canvas/1/transcript/1/transcripts",
          hitCount: 2,
          value: "Phil knew that a Mr. <em>Bungle</em> wouldn't have many friends. He wouldn't want to be like Mr. <em>Bungle</em>."
        },
      ];
      const matchedTranscriptLines = getMatchedTranscriptLines(searchHits, 'bungle', transcripts);
      expect(matchedTranscriptLines).toHaveLength(3);
      expect(matchedTranscriptLines[0]).toEqual({
        id: 0,
        begin: 71.9, end: 82,
        tag: "TIMED_CUE",
        text: "Then, in the lunchroom, Mr. Bungle was so <br >clumsy and impolite that he knocked over <br >everything. And no one wanted to sit next <br >to him.",
        match: "Then, in the lunchroom, Mr. <span class=\"ramp--transcript_highlight\">Bungle</span> was so <br>clumsy and impolite that he knocked over <br>everything. And no one wanted to sit next <br>to him.",
        matchCount: 1,
      });
      expect(matchedTranscriptLines[2]).toEqual({
        id: 3,
        begin: 96.4,
        end: 102.5,
        tag: "TIMED_CUE",
        text: "Phil knew that a Mr. Bungle wouldn't have <br >many friends. He wouldn't want to be like <br >Mr. Bungle.",
        match: "Phil knew that a Mr. <span class=\"ramp--transcript_highlight\">Bungle</span> wouldn't have <br>many friends. He wouldn't want to be like <br>Mr. <span class=\"ramp--transcript_highlight\">Bungle</span>.",
        matchCount: 2,
      });
    });
  });

  describe('parseContentSearchResponse()', () => {
    describe('with timed-text', () => {
      const transcriptCues = [
        { id: 0, begin: 0.0, end: 10.0, text: 'The <i>party</i> has <i>begun</i>.' },
        { id: 1, begin: 71.9, end: 82.0, text: 'I believe that on the first night I went to Gatsby\'s house' },
        { id: 2, begin: 83.0, end: 85.0, text: 'I was one of the few guests who had actually been invited to Long Island.' },
        { id: 3, begin: 90.4, end: 95.3, text: 'People were not invited-they went there. They got into automobiles which bore them out to [Long Island],' },
        { id: 4, begin: 96.4, end: 102.5, text: 'and somehow they ended up at Gatsby\'s door.' },
        { id: 5, begin: 105.0, end: 109.2, text: 'Once there they were introduced by somebody who knew G-a-t-s-b-y,' },
        { id: 6, begin: 112.5, end: 120.5, text: 'and after that they conducted themselves according to the rules of behaviour associated with an amusement park.' },
        { id: 7, begin: 121.3, end: 123.9, text: 'Sometimes they came and went without having met Gatsby at all,' },
        { id: 8, begin: 124.1, end: 125.0, text: '<i>came</i> for the <i>party</i> with a simplicity of heart that was its own ticket of admission.' },
        { id: 9, begin: 126.1, end: 128.3, text: 'It was Dr. Eckleburg, who was at the front of the line.' }
      ];

      test('returns all matches for a character only search query', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=gatsby",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "Sometimes they came and went without having met <em>Gatsby</em> at all,",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:02:01.300,00:02:03.900"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'gatsby', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: true
          },
          [
            {
              filename: 'great-gatsby.vtt',
              format: 'text/vtt',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(1);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'TIMED_CUE',
          begin: 121.3,
          end: 123.9,
          id: 7,
          match: 'Sometimes they came and went without having met <span class="ramp--transcript_highlight">Gatsby</span> at all,',
          matchCount: 1,
          text: 'Sometimes they came and went without having met Gatsby at all,',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 1
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:02:01.300,00:02:03.900',
              value: 'Sometimes they came and went without having met <em>Gatsby</em> at all,',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });

      test('returns all matches for a query starts with punctuation', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=[long island]",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/d7eb9ce6-7c3d-4ac1-8bea-20edb6dc0ca6",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "I was one of the few guests who had actually been invited to <em>Long</em> <em>Island</em>.",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:23.000,00:01:25.000"
            },
            {
              "id": "https://example.com/manifest/canvas/1/search/d7eb9ce6-7c3d-4ac1-8bea-20edb6dc0ca6",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "People were not invited-they went there. They got into automobiles which bore them out to [<em>Long</em> <em>Island</em>],",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:30.400,00:01:35.300"
            },
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, '[long island]', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: true
          },
          [
            {
              filename: 'great-gatsby.vtt',
              format: 'text/vtt',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(2);
        expect(matchedTranscriptLines[1]).toEqual({
          tag: 'TIMED_CUE',
          begin: 90.4,
          end: 95.3,
          id: 3,
          match: 'People were not invited-they went there. They got into automobiles which bore them out to [<span class="ramp--transcript_highlight">Long Island</span>],',
          matchCount: 1,
          text: 'People were not invited-they went there. They got into automobiles which bore them out to [Long Island],',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 2
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:23.000,00:01:25.000',
              value: 'I was one of the few guests who had actually been invited to <em>Long</em> <em>Island</em>.',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:30.400,00:01:35.300',
              value: 'People were not invited-they went there. They got into automobiles which bore them out to [<em>Long</em> <em>Island</em>],',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
          ]
        });
      });

      test('returns all matches with apostrophe in the search query', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=gatsby's",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/d7eb9ce6-7c3d-4ac1-8bea-20edb6dc0ca6",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "I believe that on the first night I went to <em>Gatsby\'s</em> house",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:11.900,00:01:22.000"
            },
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "and somehow they ended up at <em>Gatsby\'s</em> door.",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:36.400,00:01:42.500"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'gatsby\'s', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: true
          },
          [
            {
              filename: 'great-gatsby.vtt',
              format: 'text/vtt',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(2);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'TIMED_CUE',
          begin: 71.9,
          end: 82.0,
          id: 1,
          match: 'I believe that on the first night I went to <span class="ramp--transcript_highlight">Gatsby\'s</span> house',
          matchCount: 1,
          text: 'I believe that on the first night I went to Gatsby\'s house',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 2
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:11.900,00:01:22.000',
              value: 'I believe that on the first night I went to <em>Gatsby\'s</em> house',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:36.400,00:01:42.500',
              value: 'and somehow they ended up at <em>Gatsby\'s</em> door.',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });

      test('returns all match for a query with punctuation (not apostrophe) in between characters', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=g-a-t-s-b-y",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/d7eb9ce6-7c3d-4ac1-8bea-20edb6dc0ca6",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "Once there they were introduced by somebody who knew <em>G</em>-<em>a</em>-<em>t</em>-<em>s</em>-<em>b</em>-<em>y</em>,",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:45.000,00:01:49.200"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'g-a-t-s-b-y', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: true
          },
          [
            {
              filename: 'great-gatsby.vtt',
              format: 'text/vtt',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(1);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'TIMED_CUE',
          begin: 105.0,
          end: 109.2,
          id: 5,
          match: 'Once there they were introduced by somebody who knew <span class="ramp--transcript_highlight">G-a-t-s-b-y</span>,',
          matchCount: 1,
          text: 'Once there they were introduced by somebody who knew G-a-t-s-b-y,',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 1
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:45.000,00:01:49.200',
              value: 'Once there they were introduced by somebody who knew <em>G</em>-<em>a</em>-<em>t</em>-<em>s</em>-<em>b</em>-<em>y</em>,',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });

      test('returns all matches without punctuation when character matches', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=dr%20eckleburg",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/d7eb9ce6-7c3d-4ac1-8bea-20edb6dc0ca6",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "It was <em>Dr</em>. <em>Eckleburg</em>, who was at the front of the line.",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:02:06.100,00:02:08.300"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'dr eckleburg', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: true
          },
          [
            {
              filename: 'great-gatsby.vtt',
              format: 'text/vtt',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(1);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'TIMED_CUE',
          begin: 126.1
          , end: 128.3,
          id: 9,
          match: 'It was <span class="ramp--transcript_highlight">Dr. Eckleburg</span>, who was at the front of the line.',
          matchCount: 1,
          text: 'It was Dr. Eckleburg, who was at the front of the line.',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 1
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:02:06.100,00:02:08.300',
              value: 'It was <em>Dr</em>. <em>Eckleburg</em>, who was at the front of the line.',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
          ]
        });
      });

      test('returns all matches for search query with characters followed by punctuation', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=invited",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "I was one of the few guests who had actually been <em>invited</em> to Long Island.",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:23.000,00:01:25.000"
            },
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "People were not <em>invited</em>-they went there. They got into automobiles which bore them out to [Long Island],",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:30.400,00:01:35.300"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'invited', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: true
          },
          [
            {
              filename: 'great-gatsby.vtt',
              format: 'text/vtt',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(2);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'TIMED_CUE',
          begin: 83.0,
          end: 85.0,
          id: 2,
          match: 'I was one of the few guests who had actually been <span class="ramp--transcript_highlight">invited</span> to Long Island.',
          matchCount: 1,
          text: 'I was one of the few guests who had actually been invited to Long Island.',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 2
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:23.000,00:01:25.000',
              value: 'I was one of the few guests who had actually been <em>invited</em> to Long Island.',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:01:30.400,00:01:35.300',
              value: 'People were not <em>invited</em>-they went there. They got into automobiles which bore them out to [Long Island],',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });

      test('returns all matches with inline HTML', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=party",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "The <em>party</em> has begun.",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:00:00.00,00:00:10.000"
            },
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "came for the <em>party</em> with a simplicity of heart that was its own ticket of admission.",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:02:04.100,00:02:05.000"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'party', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: true
          },
          [
            {
              filename: 'great-gatsby.vtt',
              format: 'text/vtt',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(2);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'TIMED_CUE',
          begin: 0.0,
          end: 10.0,
          id: 0,
          match: 'The <i><span class=\"ramp--transcript_highlight\">party</span></i> has <i>begun</i>.',
          matchCount: 1,
          text: 'The <i>party</i> has <i>begun</i>.',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 2
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:00:00.00,00:00:10.000',
              value: 'The <em>party</em> has begun.',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:02:04.100,00:02:05.000',
              value: 'came for the <em>party</em> with a simplicity of heart that was its own ticket of admission.',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });

      // When part of the cue is not displayed because they are separated by an invalid new line inside the cue block
      describe('with invalid cue blocks', () => {
        test('does not return matches for search hits without an associated timestamp', () => {
          const response = {
            "@context": "http://iiif.io/api/search/2/context.json",
            "id": "https://example.com/manifest/canvas/1/search?q=gatsby",
            "type": "AnnotationPage",
            "items": [
              {
                "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
                "type": "Annotation",
                "motivation": "supplementing",
                "body":
                {
                  "type": "TextualBody",
                  "value": "Sometimes they came and went without having met <em>Gatsby</em> at all,",
                  "format": "text/plain"
                },
                "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:02:01.300,00:02:03.900"
              },
              {
                "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-1342-45cb-asve-9492df39c657",
                "type": "Annotation",
                "motivation": "supplementing",
                "body":
                {
                  "type": "TextualBody",
                  "value": "One did not need to be invited to be at one of the Great <em>Gatsby</em>'s parties.",
                  "format": "text/plain"
                },
                "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
              },
            ]
          };
          const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
            response, 'gatsby', transcriptCues,
            {
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              isTimed: true
            },
            [
              {
                filename: 'great-gatsby.vtt',
                format: 'text/vtt',
                url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              }
            ]
          );
          expect(matchedTranscriptLines).toHaveLength(1);
          expect(matchedTranscriptLines[0]).toEqual({
            tag: 'TIMED_CUE',
            begin: 121.3,
            end: 123.9,
            id: 7,
            match: 'Sometimes they came and went without having met <span class="ramp--transcript_highlight">Gatsby</span> at all,',
            matchCount: 1,
            text: 'Sometimes they came and went without having met Gatsby at all,',
          });
          expect(hitCounts).toEqual([{
            transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            numberOfHits: 1
          }]);
          expect(allSearchHits).toEqual({
            'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
              {
                hitCount: 1,
                target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts#t=00:02:01.300,00:02:03.900',
                value: 'Sometimes they came and went without having met <em>Gatsby</em> at all,',
                targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              }, {
                hitCount: 1,
                target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
                value: 'One did not need to be invited to be at one of the Great <em>Gatsby</em>\'s parties.',
                targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              }
            ]
          });
        });
      });
    });

    describe('with untimed text', () => {
      const transcriptCues = [
        {
          id: 0,
          text: 'The party has begun. The guest list was long.',
          tag: 'NON_TIMED_LINE',
          textDisplayed: 'The party has begun. The guest list was long'
        },
        {
          id: 1,
          text: "I believe that on the first night I went to Gatsby's house",
          tag: 'NON_TIMED_LINE',
          textDisplayed: "I believe that on the first night I went to Gatsby's house"
        },
        {
          id: 2,
          text: 'I was one of the few guests who had actually been invited to Long Island.',
          tag: 'NON_TIMED_LINE',
          textDisplayed: 'I was one of the few guests who had actually been invited to Long Island.'
        },
        {
          id: 3,
          text: 'People were not invited-they went there. They got into automobiles which bore them out to [Long Island],',
          tag: 'NON_TIMED_LINE',
          textDisplayed: '<strong>People</strong> were not invited-they went there. They got into automobiles which bore them out to [Long Island],'
        },
        {
          id: 4,
          text: "and somehow they ended up at Gatsby's door.",
          tag: 'NON_TIMED_LINE',
          textDisplayed: "and somehow they ended up at Gatsby's door."
        },
        {
          id: 5,
          text: 'Once there they were introduced by somebody who knew G-a-t-s-b-y,',
          tag: 'NON_TIMED_LINE',
          textDisplayed: 'Once there they were introduced by somebody who knew G-a-t-s-b-y,'
        },
        {
          id: 6,
          text: 'and after that they conducted themselves according to the rules of behaviour associated with an amusement park.',
          tag: 'NON_TIMED_LINE',
          textDisplayed: 'and after that they conducted themselves according to the rules of behaviour associated with an amusement park.'
        },
        {
          id: 7,
          text: 'Sometimes they came and went without having met Gatsby at all,',
          tag: 'NON_TIMED_LINE',
          textDisplayed: 'Sometimes they came and went without having met Gatsby at all,'
        },
        {
          id: 8,
          text: 'came for the party with a simplicity of heart that was its own ticket of admission.',
          tag: 'NON_TIMED_LINE',
          textDisplayed: 'came for the party with a simplicity of heart that was its own ticket of admission.'
        }
      ];

      test('returns all matches for a character only search query', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=gatsby",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "Sometimes they came and went without having met <em>Gatsby</em> at all,",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'gatsby', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: false
          },
          [
            {
              filename: 'great-gatsby.docx',
              format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(1);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'NON_TIMED_LINE',
          begin: undefined,
          end: undefined,
          id: 7,
          match: 'Sometimes they came and went without having met <span class="ramp--transcript_highlight">Gatsby</span> at all,',
          matchCount: 1,
          text: 'Sometimes they came and went without having met Gatsby at all,',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 1
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              value: 'Sometimes they came and went without having met <em>Gatsby</em> at all,',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });

      test('returns exact matches with the search query for character only search query', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=guest",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "The party has begun. The <em>guest</em> list was long",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'guest', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: false
          },
          [
            {
              filename: 'great-gatsby.docx',
              format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(1);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'NON_TIMED_LINE',
          begin: undefined,
          end: undefined,
          id: 0,
          match: 'The party has begun. The <span class="ramp--transcript_highlight">guest</span> list was long',
          matchCount: 1,
          text: 'The party has begun. The guest list was long',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 1
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              value: 'The party has begun. The <em>guest</em> list was long',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });

      test('returns all matches for a query starts with punctuation', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=[long%20island]",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/d7eb9ce6-7c3d-4ac1-8bea-20edb6dc0ca6",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "I was one of the few guests who had actually been invited to <em>Long</em> <em>Island</em>.",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
            },
            {
              "id": "https://example.com/manifest/canvas/1/search/d7eb9ce6-7c3d-4ac1-8bea-20edb6dc0ca6",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "People were not invited-they went there. They got into automobiles which bore them out to [<em>Long</em> <em>Island</em>],",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
            },
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, '[long island]', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: false
          },
          [
            {
              filename: 'great-gatsby.docx',
              format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(2);
        expect(matchedTranscriptLines[1]).toEqual({
          tag: 'NON_TIMED_LINE',
          begin: undefined,
          end: undefined,
          id: 3,
          match: '<strong>People</strong> were not invited-they went there. They got into automobiles which bore them out to [<span class="ramp--transcript_highlight">Long Island</span>],',
          matchCount: 1,
          text: '<strong>People</strong> were not invited-they went there. They got into automobiles which bore them out to [Long Island],',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 2
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              value: 'I was one of the few guests who had actually been invited to <em>Long</em> <em>Island</em>.',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              value: 'People were not invited-they went there. They got into automobiles which bore them out to [<em>Long</em> <em>Island</em>],',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
          ]
        });
      });

      test('returns all matches with apostrophe in the search query', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=gatsby's",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/d7eb9ce6-7c3d-4ac1-8bea-20edb6dc0ca6",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "I believe that on the first night I went to <em>Gatsby\'s</em> house",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
            },
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "and somehow they ended up at <em>Gatsby\'s</em> door.",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'gatsby\'s', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: false
          },
          [
            {
              filename: 'great-gatsby.docx',
              format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(2);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'NON_TIMED_LINE',
          begin: undefined,
          end: undefined,
          id: 1,
          match: 'I believe that on the first night I went to <span class="ramp--transcript_highlight">Gatsby\'s</span> house',
          matchCount: 1,
          text: 'I believe that on the first night I went to Gatsby\'s house',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 2
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              value: 'I believe that on the first night I went to <em>Gatsby\'s</em> house',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              value: 'and somehow they ended up at <em>Gatsby\'s</em> door.',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });

      test('returns all match for a query with punctuation (not apostrophe) in between characters', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=g-a-t-s-b-y",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/d7eb9ce6-7c3d-4ac1-8bea-20edb6dc0ca6",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "Once there they were introduced by somebody who knew <em>G</em>-<em>a</em>-<em>t</em>-<em>s</em>-<em>b</em>-<em>y</em>,",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'g-a-t-s-b-y', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: false
          },
          [
            {
              filename: 'great-gatsby.docx',
              format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(1);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'NON_TIMED_LINE',
          begin: undefined,
          end: undefined,
          id: 5,
          match: 'Once there they were introduced by somebody who knew <span class="ramp--transcript_highlight">G-a-t-s-b-y</span>,',
          matchCount: 1,
          text: 'Once there they were introduced by somebody who knew G-a-t-s-b-y,',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 1
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              value: 'Once there they were introduced by somebody who knew <em>G</em>-<em>a</em>-<em>t</em>-<em>s</em>-<em>b</em>-<em>y</em>,',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });

      test('returns all matches for search query with characters followed by punctuation', () => {
        const response = {
          "@context": "http://iiif.io/api/search/2/context.json",
          "id": "https://example.com/manifest/canvas/1/search?q=gatsby",
          "type": "AnnotationPage",
          "items": [
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "I was one of the few guests who had actually been <em>invited</em> to Long Island.",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
            },
            {
              "id": "https://example.com/manifest/canvas/1/search/9cdb2efc-12e0-45cb-bd6e-9492df39c657",
              "type": "Annotation",
              "motivation": "supplementing",
              "body":
              {
                "type": "TextualBody",
                "value": "People were not <em>invited</em>-they went there. They got into automobiles which bore them out to [Long Island],",
                "format": "text/plain"
              },
              "target": "https://example.com/manifest/canvas/1/supplemental_files/1/transcripts"
            }
          ]
        };
        const { matchedTranscriptLines, hitCounts, allSearchHits } = parseContentSearchResponse(
          response, 'invited', transcriptCues,
          {
            url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            isTimed: false
          },
          [
            {
              filename: 'great-gatsby.docx',
              format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              url: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        );
        expect(matchedTranscriptLines).toHaveLength(2);
        expect(matchedTranscriptLines[0]).toEqual({
          tag: 'NON_TIMED_LINE',
          begin: undefined,
          end: undefined,
          id: 2,
          match: 'I was one of the few guests who had actually been <span class="ramp--transcript_highlight">invited</span> to Long Island.',
          matchCount: 1,
          text: 'I was one of the few guests who had actually been invited to Long Island.',
        });
        expect(hitCounts).toEqual([{
          transcriptURL: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
          numberOfHits: 2
        }]);
        expect(allSearchHits).toEqual({
          'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts': [
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              value: 'I was one of the few guests who had actually been <em>invited</em> to Long Island.',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            },
            {
              hitCount: 1,
              target: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
              value: 'People were not <em>invited</em>-they went there. They got into automobiles which bore them out to [Long Island],',
              targetURI: 'https://example.com/manifest/canvas/1/supplemental_files/1/transcripts',
            }
          ]
        });
      });
    });
  });

  describe('addHighlightTags', () => {
    test('highlights a single match in plain text', () => {
      const searchResText = 'This is a <em>test</em> string.';
      const styledText = 'This is a test string.';
      const result = addHighlightTags(searchResText, styledText, 'test');
      expect(result).toBe('This is a <span class="ramp--transcript_highlight">test</span> string.');
    });

    test('handles consecutive <em> tags', () => {
      const searchResText = 'This is a test <em>s</em>-<em>t</em>-<em>r</em>-<em>i</em>-<em>n</em>-<em>g</em>.';
      const styledText = 'This is a test s-t-r-i-n-g.';
      const result = addHighlightTags(searchResText, styledText, 's-t-r-i-n-g');
      expect(result).toBe('This is a test <span class="ramp--transcript_highlight">s-t-r-i-n-g</span>.');
    });

    test('handles styled text with HTML tags', () => {
      const searchResText = 'This is a <em>test</em> string.';
      const styledText = 'This is a <b>test</b> string.';
      const result = addHighlightTags(searchResText, styledText, 'test');
      expect(result).toBe('This is a <b><span class="ramp--transcript_highlight">test</span></b> string.');
    });

    test('highlights multiple matches in plain text', () => {
      const searchResText = 'This is a <em>test</em> string, to <em>test</em> multiple search hits in one string.';
      const styledText = 'This is a test string, to test multiple search hits in one string.';
      const result = addHighlightTags(searchResText, styledText, 'test');
      // Both "test" should be highlighted separately
      expect(result).toBe('This is a <span class="ramp--transcript_highlight">test</span> string, to \
<span class="ramp--transcript_highlight">test</span> multiple search hits in one string.');
    });

    test('highlights matches with nested HTML', () => {
      const searchResText = 'This is a <em>test string</em> to test nested HTML.';
      const styledText = 'This is a <b>test <i>string</i></b> to test nested HTML';
      const result = addHighlightTags(searchResText, styledText, 'test string');
      expect(result).toBe('This is a <b><span class="ramp--transcript_highlight">test <i>\
string</i></span></b> to test nested HTML');
    });
  });
});
