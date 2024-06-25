import React from 'react';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

const DocumentPreview = ({ fileUrl }) => {
    const docs = [{ uri: fileUrl }];

    return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />;
};

export default DocumentPreview;
