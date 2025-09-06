from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from datetime import datetime
import traceback

from services.content_service import ContentService
from services.template_service import TemplateService
from models.gpt_generator import GPTGenerator
from models.text_optimizer import TextOptimizer
from models.seo_analyzer import SEOAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize services
content_service = ContentService()
template_service = TemplateService()
gpt_generator = GPTGenerator()
text_optimizer = TextOptimizer()
seo_analyzer = SEOAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'content_generation',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

@app.route('/generate', methods=['POST'])
def generate_content():
    """Generate content using AI"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['prompt', 'content_type', 'tone', 'length']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Extract parameters
        prompt = data['prompt']
        content_type = data['content_type']
        tone = data['tone']
        length = data['length']
        keywords = data.get('keywords', [])
        target_audience = data.get('target_audience', 'general')
        language = data.get('language', 'en')
        
        # Generate content
        result = content_service.generate_content(
            prompt=prompt,
            content_type=content_type,
            tone=tone,
            length=length,
            keywords=keywords,
            target_audience=target_audience,
            language=language
        )
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/optimize', methods=['POST'])
def optimize_content():
    """Optimize existing content"""
    try:
        data = request.get_json()
        
        if 'content' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: content'
            }), 400
        
        content = data['content']
        optimization_type = data.get('type', 'general')
        target_metrics = data.get('target_metrics', {})
        
        # Optimize content
        result = text_optimizer.optimize(
            content=content,
            optimization_type=optimization_type,
            target_metrics=target_metrics
        )
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        logger.error(f"Error optimizing content: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/analyze-seo', methods=['POST'])
def analyze_seo():
    """Analyze content for SEO"""
    try:
        data = request.get_json()
        
        if 'content' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: content'
            }), 400
        
        content = data['content']
        target_keywords = data.get('target_keywords', [])
        
        # Analyze SEO
        result = seo_analyzer.analyze(
            content=content,
            target_keywords=target_keywords
        )
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        logger.error(f"Error analyzing SEO: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/templates', methods=['GET'])
def get_templates():
    """Get available content templates"""
    try:
        content_type = request.args.get('type', 'all')
        templates = template_service.get_templates(content_type)
        
        return jsonify({
            'success': True,
            'data': templates
        })
        
    except Exception as e:
        logger.error(f"Error getting templates: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/templates/<template_id>', methods=['GET'])
def get_template(template_id):
    """Get specific template"""
    try:
        template = template_service.get_template(template_id)
        
        if not template:
            return jsonify({
                'success': False,
                'error': 'Template not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': template
        })
        
    except Exception as e:
        logger.error(f"Error getting template: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/batch-generate', methods=['POST'])
def batch_generate():
    """Generate multiple pieces of content in batch"""
    try:
        data = request.get_json()
        
        if 'requests' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: requests'
            }), 400
        
        requests = data['requests']
        if not isinstance(requests, list) or len(requests) == 0:
            return jsonify({
                'success': False,
                'error': 'Requests must be a non-empty list'
            }), 400
        
        # Process batch requests
        results = []
        for req in requests:
            try:
                result = content_service.generate_content(**req)
                results.append({
                    'success': True,
                    'data': result
                })
            except Exception as e:
                results.append({
                    'success': False,
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'data': results
        })
        
    except Exception as e:
        logger.error(f"Error in batch generation: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Content Generation Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
